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
                // Local Palestinian territories
                {
                    name: 'Judea Province',
                    color: '#8B0000',
                    coordinates: [
                        [31.2, 34.3], [31.2, 34.9], [31.4, 35.0], [31.6, 35.1], 
                        [31.8, 35.2], [32.0, 35.3], [32.1, 35.2], [32.0, 35.0],
                        [31.9, 34.8], [31.7, 34.5], [31.5, 34.3], [31.2, 34.3]
                    ],
                    significance: 'Roman province including Jerusalem, Bethlehem. Governed by Roman prefects/procurators.'
                },
                {
                    name: 'Galilee (Herod Antipas)',
                    color: '#4682B4',
                    coordinates: [
                        [32.5, 35.1], [32.5, 35.8], [33.3, 35.8], [33.3, 35.6],
                        [33.1, 35.5], [32.9, 35.3], [32.7, 35.2], [32.5, 35.1]
                    ],
                    significance: 'Tetrarchy of Herod Antipas. Jesus\' homeland - Nazareth, Capernaum, Sea of Galilee.'
                },
                {
                    name: 'Samaria',
                    color: '#DAA520',
                    coordinates: [
                        [32.0, 35.0], [32.0, 35.4], [32.4, 35.4], [32.5, 35.2],
                        [32.3, 35.1], [32.1, 35.0], [32.0, 35.0]
                    ],
                    significance: 'Samaritan region. Jesus met woman at well, passed through en route to Jerusalem.'
                },
                {
                    name: 'Perea',
                    color: '#9370DB',
                    coordinates: [
                        [32.0, 35.6], [32.0, 35.9], [32.3, 36.0], [32.5, 35.8],
                        [32.3, 35.7], [32.1, 35.6], [32.0, 35.6]
                    ],
                    significance: 'Part of Herod Antipas\' territory east of Jordan. John the Baptist ministered here.'
                },
                {
                    name: 'Decapolis',
                    color: '#20B2AA',
                    coordinates: [
                        [32.3, 35.4], [32.3, 35.9], [32.8, 36.2], [33.0, 36.0],
                        [32.8, 35.7], [32.5, 35.5], [32.3, 35.4]
                    ],
                    significance: 'League of 10 Hellenistic cities. Jesus healed demon-possessed man in region.'
                },
                {
                    name: 'Iturea & Trachonitis',
                    color: '#8FBC8F',
                    coordinates: [
                        [33.0, 35.8], [33.0, 36.3], [33.5, 36.5], [33.8, 36.3],
                        [33.6, 36.0], [33.3, 35.9], [33.0, 35.8]
                    ],
                    significance: 'Tetrarchy of Philip. Caesarea Philippi - Peter\'s confession, Transfiguration nearby.'
                },
                {
                    name: 'Nabatean Kingdom',
                    color: '#CD853F',
                    coordinates: [
                        [29.5, 34.8], [29.5, 35.5], [30.8, 36.0], [31.5, 35.8],
                        [31.2, 35.2], [30.5, 34.9], [29.5, 34.8]
                    ],
                    significance: 'Independent Arab kingdom. Controlled trade routes, later conflict with Herod Antipas.'
                },
                {
                    name: 'Roman Syria',
                    color: '#B22222',
                    coordinates: [
                        [33.5, 35.8], [33.5, 37.0], [36.0, 37.5], [36.5, 36.8],
                        [36.0, 36.0], [35.0, 35.9], [33.5, 35.8]
                    ],
                    significance: 'Roman province. Governor Quirinius conducted census. Paul converted on road to Damascus.'
                },
                
                // Broader Roman Empire provinces
                {
                    name: 'Asia (Roman Province)',
                    color: '#DC143C',
                    coordinates: [
                        [39.5, 26.0], [39.5, 30.0], [37.0, 30.5], 
                        [36.5, 28.0], [37.5, 26.0], [39.5, 26.0]
                    ],
                    significance: 'Wealthy senatorial province. Contains Seven Churches of Revelation. Capital: Ephesus.'
                },
                {
                    name: 'Galatia',
                    color: '#FF8C00',
                    coordinates: [
                        [39.5, 30.0], [39.5, 35.0], [37.0, 35.5], 
                        [36.5, 30.5], [39.5, 30.0]
                    ],
                    significance: 'Recipients of Paul\'s Epistle to Galatians. Contains Antioch, Iconium, Lystra, Derbe.'
                },
                {
                    name: 'Cappadocia',
                    color: '#8A2BE2',
                    coordinates: [
                        [39.5, 35.0], [39.5, 39.0], [37.0, 39.5], 
                        [36.0, 35.5], [39.5, 35.0]
                    ],
                    significance: 'Imperial province. Mentioned in Acts 2:9 (Pentecost) and 1 Peter 1:1.'
                },
                {
                    name: 'Bithynia and Pontus',
                    color: '#2E8B57',
                    coordinates: [
                        [42.0, 27.0], [42.0, 37.0], [40.0, 37.5], 
                        [39.5, 30.0], [39.5, 27.0], [42.0, 27.0]
                    ],
                    significance: 'Northern Asia Minor province. Mentioned in 1 Peter 1:1 and Acts 16:7.'
                },
                {
                    name: 'Cilicia',
                    color: '#DAA520',
                    coordinates: [
                        [37.0, 34.0], [37.0, 36.5], [35.5, 36.5], 
                        [35.5, 34.0], [37.0, 34.0]
                    ],
                    significance: 'Paul\'s birthplace Tarsus. Southeastern Asia Minor coastal province.'
                },
                {
                    name: 'Macedonia',
                    color: '#4169E1',
                    coordinates: [
                        [42.0, 20.0], [42.0, 26.0], [39.0, 26.0], 
                        [38.5, 21.0], [42.0, 20.0]
                    ],
                    significance: 'First European province evangelized by Paul. Churches at Philippi, Thessalonica, Berea.'
                },
                {
                    name: 'Achaia',
                    color: '#228B22',
                    coordinates: [
                        [39.0, 19.0], [39.0, 26.0], [34.5, 26.0], 
                        [34.5, 19.0], [39.0, 19.0]
                    ],
                    significance: 'Southern Greece. Paul ministered in Corinth and Athens. Senatorial province.'
                },
                {
                    name: 'Pamphylia',
                    color: '#FF69B4',
                    coordinates: [
                        [37.0, 29.5], [37.0, 32.0], [36.0, 32.0], 
                        [36.0, 29.5], [37.0, 29.5]
                    ],
                    significance: 'Southern Asia Minor coast. Paul\'s first missionary journey through Perga and Attalia.'
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
                },
                
                // Paul's missionary journey cities
                { 
                    name: 'Antioch (Pisidia)', 
                    coords: [38.3101, 30.6345], 
                    color: '#FF8C00',
                    description: 'Paul\'s first missionary journey. Synagogue preaching, Gentile conversion (Acts 13:14-52)'
                },
                { 
                    name: 'Iconium', 
                    coords: [37.8746, 32.4932], 
                    color: '#FF8C00',
                    description: 'Paul and Barnabas preached here. Opposition from unbelieving Jews (Acts 14:1-6)'
                },
                { 
                    name: 'Lystra', 
                    coords: [37.6158, 32.4215], 
                    color: '#FF8C00',
                    description: 'Paul healed lame man, mistaken for gods. Timothy\'s hometown (Acts 14:6-20)'
                },
                { 
                    name: 'Derbe', 
                    coords: [37.3000, 32.7500], 
                    color: '#FF8C00',
                    description: 'Paul\'s preaching made many disciples. Return journey stop (Acts 14:20-21)'
                },
                { 
                    name: 'Tarsus', 
                    coords: [36.9177, 34.8956], 
                    color: '#DAA520',
                    description: 'Paul\'s birthplace. "No mean city" - major center of learning (Acts 21:39)'
                },
                { 
                    name: 'Philippi', 
                    coords: [41.0136, 24.2872], 
                    color: '#4169E1',
                    description: 'First European church. Lydia\'s conversion, Paul and Silas imprisoned (Acts 16:12-40)'
                },
                { 
                    name: 'Thessalonica', 
                    coords: [40.6401, 22.9444], 
                    color: '#4169E1',
                    description: 'Capital of Macedonia. Paul reasoned from Scriptures, church planted (Acts 17:1-9)'
                },
                { 
                    name: 'Berea', 
                    coords: [40.5228, 22.2019], 
                    color: '#4169E1',
                    description: 'Noble Bereans searched Scriptures daily to verify Paul\'s teaching (Acts 17:10-12)'
                },
                { 
                    name: 'Athens', 
                    coords: [37.9838, 23.7275], 
                    color: '#228B22',
                    description: 'Paul\'s Areopagus speech to philosophers. "Unknown God" sermon (Acts 17:16-34)'
                },
                { 
                    name: 'Corinth', 
                    coords: [37.9065, 22.8756], 
                    color: '#228B22',
                    description: 'Paul\'s 18-month ministry. Met Aquila and Priscilla, two epistles written (Acts 18:1-17)'
                },
                { 
                    name: 'Cenchrea', 
                    coords: [37.8833, 23.0000], 
                    color: '#228B22',
                    description: 'Port of Corinth. Phoebe was deacon here, Paul took vow (Rom 16:1, Acts 18:18)'
                }
            ]
        };
        
        return locations[periodId] || [];
    }
}

customElements.define('bible-atlas-page', BibleAtlasPage);