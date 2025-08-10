class BibleAtlasPage extends HTMLElement {
    constructor() {
        super();
        this.map = null;
        this.currentPeriodIndex = 0;
        this.periods = [
            { id: 'patriarchal', name: 'Patriarchal Period', year: -2000, dateRange: '2000-1500 BC' },
            { id: 'exodus', name: 'Exodus Period', year: -1500, dateRange: '1500-1200 BC' },
            { id: 'united-kingdom', name: 'United Kingdom', year: -1000, dateRange: '1000-930 BC' },
            { id: 'divided-kingdom', name: 'Divided Kingdom', year: -930, dateRange: '930-586 BC' },
            { id: 'new-testament', name: 'New Testament', year: 30, dateRange: '30-100 AD' }
        ];
        this.mapId = 'bible-map-' + Math.random().toString(36).substr(2, 9);
    }

    connectedCallback() {
        this.loadLeaflet().then(() => {
            this.render();
            setTimeout(() => {
                this.initializeMap();
                this.loadPeriodData(this.periods[this.currentPeriodIndex]);
            }, 300);
        });
    }

    async loadLeaflet() {
        // Load Leaflet CSS in main document head
        if (!document.querySelector('link[href*="leaflet.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
                script.onload = () => {
                    setTimeout(resolve, 200);
                };
                document.head.appendChild(script);
            });
        }
    }

    render() {
        // Render WITHOUT Shadow DOM to avoid CSS isolation issues
        this.innerHTML = `
            <style>
                bible-atlas-page {
                    display: block;
                    padding: 1rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                bible-atlas-page h1 {
                    color: #f0f6fc;
                    font-size: 2rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }

                bible-atlas-page .map-container {
                    background: #1c2128;
                    border-radius: 8px;
                    padding: 1rem;
                    border: 1px solid #30363d;
                    position: relative;
                }

                bible-atlas-page #${this.mapId} {
                    height: 600px;
                    width: 100%;
                    border-radius: 4px;
                    background: #0f1419;
                    position: relative;
                    z-index: 1;
                }

                bible-atlas-page .timeline-container {
                    margin-top: 1rem;
                    background: #1c2128;
                    border-radius: 8px;
                    padding: 1rem;
                    border: 1px solid #30363d;
                }

                bible-atlas-page .timeline-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                bible-atlas-page .period-info {
                    flex: 1;
                    text-align: center;
                }

                bible-atlas-page .period-name {
                    font-size: 1.2rem;
                    color: #f0f6fc;
                    font-weight: 600;
                }

                bible-atlas-page .period-date {
                    font-size: 0.9rem;
                    color: #8b949e;
                    margin-top: 0.25rem;
                }

                bible-atlas-page .timeline-nav {
                    display: flex;
                    gap: 0.5rem;
                }

                bible-atlas-page button {
                    background: #238636;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }

                bible-atlas-page button:hover:not(:disabled) {
                    background: #2ea043;
                }

                bible-atlas-page button:disabled {
                    background: #30363d;
                    color: #8b949e;
                    cursor: not-allowed;
                }

                bible-atlas-page .timeline-dots {
                    display: flex;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 1rem;
                }

                bible-atlas-page .timeline-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #30363d;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                bible-atlas-page .timeline-dot.active {
                    background: #238636;
                }

                bible-atlas-page .timeline-dot:hover {
                    background: #8b949e;
                }
            </style>

            <h1>Bible Atlas</h1>
            
            <div class="map-container">
                <div id="${this.mapId}"></div>
            </div>

            <div class="timeline-container">
                <div class="timeline-controls">
                    <div class="timeline-nav">
                        <button id="prev-period">← Previous</button>
                    </div>
                    
                    <div class="period-info">
                        <div class="period-name" id="period-name"></div>
                        <div class="period-date" id="period-date"></div>
                    </div>
                    
                    <div class="timeline-nav">
                        <button id="next-period">Next →</button>
                    </div>
                </div>
                
                <div class="timeline-dots" id="timeline-dots"></div>
            </div>
        `;

        this.setupEventListeners();
        this.updateTimelineDisplay();
    }

    initializeMap() {
        const mapElement = this.querySelector(`#${this.mapId}`);
        
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        try {
            // Initialize Leaflet map
            this.map = L.map(mapElement, {
                center: [31.5, 35.0],
                zoom: 8,
                minZoom: 2,
                maxZoom: 15,
                attributionControl: false
            });

            // Use CartoDB tiles without labels
            const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
                attribution: '',
                maxZoom: 19,
                tileSize: 256,
                zoomOffset: 0,
                subdomains: 'abcd'
            });

            tileLayer.addTo(this.map);

            // Wait for the map container to be properly sized
            this.map.whenReady(() => {
                console.log('Map is ready');
                this.map.invalidateSize(true);
                
                // Force another resize after a delay
                setTimeout(() => {
                    this.map.invalidateSize(true);
                }, 100);
                
                // Add baseline geography
                this.addBaselineGeography();
            });

            // Additional resize attempts
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize(true);
                }
            }, 500);

            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize(true);
                }
            }, 1000);

        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }

    addBaselineGeography() {
        if (!this.map) return;

        // Add key biblical locations (always visible)
        const locations = [
            { name: 'Jerusalem', coords: [31.7683, 35.2137], color: '#FFD700' },
            { name: 'Bethlehem', coords: [31.7054, 35.2024], color: '#FFA500' },
            { name: 'Nazareth', coords: [32.7008, 35.2975], color: '#87CEEB' },
            { name: 'Damascus', coords: [33.5138, 36.2765], color: '#DDA0DD' },
            { name: 'Cairo', coords: [30.0444, 31.2357], color: '#F0E68C' }
        ];

        locations.forEach(location => {
            L.circleMarker(location.coords, {
                color: '#000',
                fillColor: location.color,
                fillOpacity: 0.8,
                radius: 6,
                weight: 2,
                pane: 'markerPane' // Ensures markers are above polygons
            }).addTo(this.map)
              .bindPopup(`<b>${location.name}</b><br>Key biblical location`)
              .bindTooltip(location.name, {permanent: false, direction: 'top'});
        });
    }

    setupEventListeners() {
        this.querySelector('#prev-period').addEventListener('click', () => {
            if (this.currentPeriodIndex > 0) {
                this.currentPeriodIndex--;
                this.transitionToPeriod(this.periods[this.currentPeriodIndex]);
            }
        });

        this.querySelector('#next-period').addEventListener('click', () => {
            if (this.currentPeriodIndex < this.periods.length - 1) {
                this.currentPeriodIndex++;
                this.transitionToPeriod(this.periods[this.currentPeriodIndex]);
            }
        });
    }

    updateTimelineDisplay() {
        const period = this.periods[this.currentPeriodIndex];
        this.querySelector('#period-name').textContent = period.name;
        this.querySelector('#period-date').textContent = period.dateRange;

        this.querySelector('#prev-period').disabled = this.currentPeriodIndex === 0;
        this.querySelector('#next-period').disabled = this.currentPeriodIndex === this.periods.length - 1;

        const dotsContainer = this.querySelector('#timeline-dots');
        dotsContainer.innerHTML = '';
        this.periods.forEach((p, index) => {
            const dot = document.createElement('div');
            dot.className = 'timeline-dot';
            if (index === this.currentPeriodIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => {
                this.currentPeriodIndex = index;
                this.transitionToPeriod(this.periods[index]);
            });
            dotsContainer.appendChild(dot);
        });
    }

    transitionToPeriod(period) {
        this.updateTimelineDisplay();
        this.loadPeriodData(period);
    }

    loadPeriodData(period) {
        if (!this.map) return;

        // Clear existing period layers
        if (this.currentPeriodLayer) {
            this.map.removeLayer(this.currentPeriodLayer);
        }

        // Get sample kingdoms for the period
        const kingdoms = this.getSampleKingdoms(period.id);
        
        this.currentPeriodLayer = L.layerGroup();
        
        // Add kingdom polygons
        kingdoms.forEach(kingdom => {
            const polygon = L.polygon(kingdom.coordinates, {
                color: kingdom.color,
                fillColor: kingdom.color,
                fillOpacity: 0.4,
                weight: 2,
                pane: 'overlayPane' // Ensures polygons are below markers
            });
            
            polygon.on('click', () => {
                L.popup()
                    .setLatLng(polygon.getBounds().getCenter())
                    .setContent(`<b>${kingdom.name}</b><br><small>${kingdom.significance}</small>`)
                    .openOn(this.map);
            });
            
            this.currentPeriodLayer.addLayer(polygon);
        });

        // Add period-specific locations
        const periodLocations = this.getPeriodLocations(period.id);
        periodLocations.forEach(location => {
            const marker = L.circleMarker(location.coords, {
                color: '#8B0000',
                fillColor: location.color,
                fillOpacity: 0.9,
                radius: 5,
                weight: 2,
                pane: 'markerPane'
            });
            
            marker.bindPopup(`<b>${location.name}</b><br><small>${location.description}</small>`);
            marker.bindTooltip(location.name, {permanent: false, direction: 'top'});
            
            this.currentPeriodLayer.addLayer(marker);
        });
        
        this.currentPeriodLayer.addTo(this.map);
    }

    getSampleKingdoms(periodId) {
        const kingdoms = {
            'patriarchal': [
                {
                    name: 'Canaan',
                    color: '#90EE90',
                    coordinates: [[31.0, 34.5], [31.0, 35.5], [33.0, 35.5], [33.0, 34.5]],
                    significance: 'The Promised Land. Abraham, Isaac, and Jacob lived here.'
                }
            ],
            'exodus': [
                {
                    name: 'Egypt',
                    color: '#FFD700',
                    coordinates: [[30.0, 31.0], [30.0, 32.0], [31.5, 32.0], [31.5, 31.0]],
                    significance: 'The Israelites were enslaved here. Moses led the Exodus.'
                }
            ],
            'united-kingdom': [
                {
                    name: 'Israel',
                    color: '#4169E1',
                    coordinates: [[31.2, 34.8], [31.2, 35.8], [33.2, 35.8], [33.2, 34.8]],
                    significance: 'United under Saul, David, and Solomon.'
                }
            ],
            'divided-kingdom': [
                {
                    name: 'Israel (North)',
                    color: '#228B22',
                    coordinates: [[32.0, 35.0], [32.0, 35.8], [33.2, 35.8], [33.2, 35.0]],
                    significance: 'Northern Kingdom. Capital: Samaria. Fell to Assyria in 722 BC.'
                },
                {
                    name: 'Judah (South)',
                    color: '#4169E1',
                    coordinates: [[31.2, 34.8], [31.2, 35.2], [32.0, 35.2], [32.0, 34.8]],
                    significance: 'Southern Kingdom. Capital: Jerusalem. Fell to Babylon in 586 BC.'
                }
            ],
            'new-testament': [
                {
                    name: 'Judea',
                    color: '#8B0000',
                    coordinates: [[31.2, 34.8], [31.2, 35.2], [32.0, 35.2], [32.0, 34.8]],
                    significance: 'Under Roman rule. Jesus was born in Bethlehem, ministered here.'
                },
                {
                    name: 'Galilee',
                    color: '#4682B4',
                    coordinates: [[32.5, 35.2], [32.5, 35.7], [33.0, 35.7], [33.0, 35.2]],
                    significance: 'Jesus grew up in Nazareth. Most of His ministry was here.'
                }
            ]
        };
        
        return kingdoms[periodId] || [];
    }

    getPeriodLocations(periodId) {
        const locations = {
            'new-testament': [
                // The 7 Churches of Revelation (Revelation 1:11, 2-3)
                { 
                    name: 'Ephesus', 
                    coords: [37.9495, 27.3478], 
                    color: '#FF6B6B',
                    description: 'Church of Ephesus - "You have left your first love" (Rev 2:1-7)'
                },
                { 
                    name: 'Smyrna', 
                    coords: [38.4192, 27.1384], 
                    color: '#4ECDC4',
                    description: 'Church of Smyrna - "Be faithful unto death" (Rev 2:8-11)'
                },
                { 
                    name: 'Pergamon', 
                    coords: [39.1181, 27.1859], 
                    color: '#45B7D1',
                    description: 'Church of Pergamon - "Where Satan\'s throne is" (Rev 2:12-17)'
                },
                { 
                    name: 'Thyatira', 
                    coords: [38.9151, 27.8434], 
                    color: '#96CEB4',
                    description: 'Church of Thyatira - "You tolerate Jezebel" (Rev 2:18-29)'
                },
                { 
                    name: 'Sardis', 
                    coords: [38.4888, 28.0394], 
                    color: '#FFEAA7',
                    description: 'Church of Sardis - "You have a name that you are alive, but you are dead" (Rev 3:1-6)'
                },
                { 
                    name: 'Philadelphia', 
                    coords: [38.9641, 28.8434], 
                    color: '#DDA0DD',
                    description: 'Church of Philadelphia - "I have set before you an open door" (Rev 3:7-13)'
                },
                { 
                    name: 'Laodicea', 
                    coords: [37.8361, 29.1061], 
                    color: '#F8B500',
                    description: 'Church of Laodicea - "You are lukewarm" (Rev 3:14-22)'
                }
            ]
        };
        
        return locations[periodId] || [];
    }
}

customElements.define('bible-atlas-page', BibleAtlasPage);