class WebNumerologyPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 0;
                }

                .hero-section {
                    background: linear-gradient(180deg, rgba(13,17,23,0) 0%, rgba(13,17,23,0.8) 100%),
                                url('https://images.unsplash.com/photo-1620662736424-ac158fa68eb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
                    background-size: cover;
                    background-position: center;
                    padding: 6rem 2rem;
                    text-align: center;
                    color: #ffffff;
                    margin-bottom: 2rem;
                    border-bottom: 1px solid #30363d;
                }

                .hero-content {
                    max-width: 800px;
                    margin: 0 auto;
                }

                h1 {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }

                .subtitle {
                    font-size: 1.2rem;
                    color: #8b949e;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .content-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 2rem 4rem;
                }

                .miracle-card {
                    background: #0d1117;
                    border: 1px solid #30363d;
                    border-radius: 8px;
                    padding: 2rem;
                    margin-bottom: 2rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .miracle-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid #21262d;
                    padding-bottom: 1rem;
                }

                .miracle-number {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #58a6ff;
                    font-family: 'Courier New', monospace;
                }

                .miracle-title {
                    font-size: 1.5rem;
                    margin: 0;
                    color: #c9d1d9;
                }

                .miracle-text {
                    line-height: 1.6;
                    color: #8b949e;
                    font-size: 1.05rem;
                }

                .highlight {
                    color: #e6edf3;
                    font-weight: 600;
                    background: rgba(88, 166, 255, 0.1);
                    padding: 0.2rem 0.4rem;
                    border-radius: 4px;
                }

                .satire-notice {
                    background: rgba(210, 153, 34, 0.15);
                    border: 1px solid rgba(210, 153, 34, 0.4);
                    color: #e3b341;
                    padding: 1rem;
                    border-radius: 6px;
                    margin-bottom: 3rem;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: start;
                    gap: 0.75rem;
                }

                code {
                    background: rgba(110, 118, 129, 0.4);
                    padding: 0.2em 0.4em;
                    border-radius: 3px;
                    font-size: 85%;
                }
            </style>

            <div class="hero-section">
                <div class="hero-content">
                    <h1>The Divine Mathematics</h1>
                    <p class="subtitle">Uncovering the miraculous numerical signature hidden within the World English Bible (WEB).</p>
                </div>
            </div>

            <div class="content-container">
                <div class="satire-notice">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" fill="currentColor">
                        <path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 14H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
                    </svg>
                    <div>
                        <strong>Editor's Note:</strong> This page is a satirical demonstration of "Data Dredging." By applying the same logic used by KJV Onlyists, we can prove that <em>any</em> translation is "mathematically perfect" if we look hard enough.
                    </div>
                </div>

                <div class="miracle-card">
                    <div class="miracle-header">
                        <div class="miracle-number">612</div>
                        <h2 class="miracle-title">The Jesus-Fish Connection</h2>
                    </div>
                    <div class="miracle-text">
                        <p>In John 21:11, the disciples catch exactly <strong>153 fish</strong>, a number long associated with evangelism and the "saved."</p>
                        <p>Critics of the WEB ignore a startling fact: In the four Gospels of the World English Bible, the name <span class="highlight">Jesus</span> appears exactly <strong>612 times</strong>.</p>
                        <p>What is 612? It is exactly <strong>4 × 153</strong>.</p>
                        <p>Four Gospels. Four distinct portraits of Christ. Each one mathematically sealed by the number of the harvest. Could a mere human committee have planned this?</p>
                    </div>
                </div>

                <div class="miracle-card">
                    <div class="miracle-header">
                        <div class="miracle-number">2100</div>
                        <h2 class="miracle-title">The King's Seal</h2>
                    </div>
                    <div class="miracle-text">
                        <p>The number <strong>7</strong> is the number of divine perfection. The number <strong>300</strong> represents victory (Gideon's army).</p>
                        <p>Across the entire World English Bible, the word <span class="highlight">King</span> appears exactly <strong>2100 times</strong>.</p>
                        <p>That is <strong>7 × 300</strong>. The perfect victory of the King. The statistical probability of this happening by chance is astronomical.</p>
                    </div>
                </div>

                <div class="miracle-card">
                    <div class="miracle-header">
                        <div class="miracle-number">245</div>
                        <h2 class="miracle-title">The Faith Formula</h2>
                    </div>
                    <div class="miracle-text">
                        <p>The New Testament is the covenant of Faith. How fitting, then, that the word <span class="highlight">Faith</span> appears exactly <strong>245 times</strong> in the NT.</p>
                        <p>245 is <strong>7 × 35</strong>.</p>
                        <p>And 35 is <strong>7 × 5</strong> (The number of Grace). Thus, Faith in the WEB is mathematically defined as <em>"Double Perfection by Grace"</em> (7 × 7 × 5).</p>
                    </div>
                </div>

                <div class="miracle-card">
                    <div class="miracle-header">
                        <div class="miracle-number">7</div>
                        <h2 class="miracle-title">The Sevenfold Seal of Revelation</h2>
                    </div>
                    <div class="miracle-text">
                        <p>The book of Revelation is structured around sevens (churches, seals, trumpets, bowls). But the World English Bible reveals a hidden layer of "Micro-Sevens" woven into the very vocabulary of the text.</p>
                        <p>The following words appear exactly <strong>7 times</strong> in the book of Revelation:</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem; font-family: monospace; font-size: 0.95rem;">
                            <div>• Prophecy</div>
                            <div>• Spirits</div>
                            <div>• Servants</div>
                            <div>• Satan</div>
                            <div>• Abyss</div>
                            <div>• Sickle</div>
                            <div>• Earthquake</div>
                            <div>• Bowl</div>
                        </div>
                        <p style="margin-top: 1rem;">Even the phrase <span class="highlight">"Spirit says"</span> appears exactly 7 times. Coincidence? Or a divine watermark?</p>
                    </div>
                </div>

                <div class="miracle-card">
                    <div class="miracle-header">
                        <div class="miracle-number">40</div>
                        <h2 class="miracle-title">The Heavenly Trial</h2>
                    </div>
                    <div class="miracle-text">
                        <p>The number <strong>40</strong> represents trial and testing in scripture (Moses, Elijah, Jesus in the wilderness).</p>
                        <p>In the book of Revelation, the word <span class="highlight">Heaven</span> appears exactly <strong>40 times</strong> (case-insensitive match). This signifies that the final trial of humanity is inextricably linked to the heavenly reality.</p>
                    </div>
                <div class="miracle-card">
                    <div class="miracle-header">
                        <div class="miracle-number">7</div>
                        <h2 class="miracle-title">The Perfect Actions of Christ</h2>
                    </div>
                    <div class="miracle-text">
                        <p>In the Gospels, the actions of the Messiah are mathematically perfected. The following phrases appear exactly <strong>7 times</strong> in the account of His life:</p>
                        <ul style="list-style-type: none; padding-left: 0;">
                            <li><span class="highlight">"Jesus took"</span> (He takes our burden)</li>
                            <li><span class="highlight">"Jesus spoke"</span> (He is the Word)</li>
                            <li><span class="highlight">"Jesus did"</span> (He finished the work)</li>
                            <li><span class="highlight">"Saw Jesus"</span> (The witness of faith)</li>
                        </ul>
                        <p>Each action is stamped with the number of perfection.</p>
                    </div>
                </div>

            </div>
        `;
    }
}

customElements.define('web-numerology-page', WebNumerologyPage);
