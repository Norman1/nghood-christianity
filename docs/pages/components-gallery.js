import { generateTOC } from '../utils/toc-generator.js';
import '../components/quiz-card.js';
import '../components/hierarchical-tree-selector.js';
import '../components/collapsible-section.js';

class ComponentsGallery extends HTMLElement {
    connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout.setAttribute('with-right', '');

        // Clear old right sidebar content from layout
        layout.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        // Set main content
        this.innerHTML = `
            <div class="content-area">
                <h1>Components Gallery</h1>
                
                <div class="intro-section">
                    <p>This page showcases all the styled components and UI elements available in the framework's global CSS. Use these as building blocks for consistent design across your application.</p>
                </div>
                
                <div class="tab-content">
                    <strong>Intro Section HTML:</strong>
                    <pre><code>&lt;div class="intro-section"&gt;
    &lt;p&gt;Your highlighted introduction text here.&lt;/p&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Typography</h2>
                
                <h1>Heading 1 - Main Page Title</h1>
                <h2>Heading 2 - Section Headers</h2>
                <h3>Heading 3 - Subsection Headers</h3>
                <h4>Heading 4 - Minor Headers</h4>
                
                <p>This is a regular paragraph with some <strong>bold text</strong> and <a href="#">a sample link</a>. The typography is optimized for readability with proper line height and spacing.</p>
                
                <h2>Code Elements</h2>
                
                <h3>Inline Code</h3>
                <p>Use inline code for short snippets: <code>const variable = 'value';</code></p>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;p&gt;Use inline code for short snippets: &lt;code&gt;const variable = 'value';&lt;/code&gt;&lt;/p&gt;</code></pre>
                </div>
                
                <h3>Code Blocks</h3>
                <pre><code>// Code block example
function exampleFunction() {
    return 'This is a pre-formatted code block';
}

const result = exampleFunction();
console.log(result);</code></pre>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;pre&gt;&lt;code&gt;// Code block example
function exampleFunction() {
    return 'This is a pre-formatted code block';
}

const result = exampleFunction();
console.log(result);&lt;/code&gt;&lt;/pre&gt;</code></pre>
                </div>
                
                <h2>Callout Boxes</h2>
                
                <p>Callout boxes provide visual emphasis for different types of information:</p>
                
                <div class="callout callout-info">
                    <strong>Info Callout:</strong> Use this for general information and tips.
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="callout callout-info"&gt;
    &lt;strong&gt;Info Callout:&lt;/strong&gt; Use this for general information and tips.
&lt;/div&gt;</code></pre>
                </div>
                
                <div class="callout callout-success">
                    <strong>Success Callout:</strong> Use this for positive feedback and completed actions.
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="callout callout-success"&gt;
    &lt;strong&gt;Success Callout:&lt;/strong&gt; Use this for positive feedback and completed actions.
&lt;/div&gt;</code></pre>
                </div>
                
                <div class="callout callout-warning">
                    <strong>Warning Callout:</strong> Use this for important cautions and potential issues.
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="callout callout-warning"&gt;
    &lt;strong&gt;Warning Callout:&lt;/strong&gt; Use this for important cautions and potential issues.
&lt;/div&gt;</code></pre>
                </div>
                
                <div class="callout callout-error">
                    <strong>Error Callout:</strong> Use this for errors and critical information.
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="callout callout-error"&gt;
    &lt;strong&gt;Error Callout:&lt;/strong&gt; Use this for errors and critical information.
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Form Elements</h2>
                
                <p>All form elements are automatically styled for the dark theme:</p>
                
                <div style="max-width: 400px; margin: 1rem 0;">
                    <label for="sample-input" style="display: block; margin-bottom: 0.5rem; color: #f0f6fc;">Sample Input:</label>
                    <input type="text" id="sample-input" placeholder="Enter some text..." style="width: 100%; margin-bottom: 1rem;">
                    
                    <label for="sample-textarea" style="display: block; margin-bottom: 0.5rem; color: #f0f6fc;">Sample Textarea:</label>
                    <textarea id="sample-textarea" placeholder="Enter multiple lines..." rows="3" style="width: 100%; margin-bottom: 1rem; resize: vertical;"></textarea>
                    
                    <label for="sample-select" style="display: block; margin-bottom: 0.5rem; color: #f0f6fc;">Sample Select:</label>
                    <select id="sample-select" style="width: 100%; margin-bottom: 1rem;">
                        <option>Option 1</option>
                        <option>Option 2</option>
                        <option>Option 3</option>
                    </select>
                    
                    <button type="button">Sample Button</button>
                </div>
                
                <div class="tab-content">
                    <strong>Form HTML:</strong>
                    <pre><code>&lt;label for="input-id"&gt;Input Label:&lt;/label&gt;
&lt;input type="text" id="input-id" placeholder="Enter text..."&gt;

&lt;label for="textarea-id"&gt;Textarea Label:&lt;/label&gt;
&lt;textarea id="textarea-id" placeholder="Enter multiple lines..." rows="3"&gt;&lt;/textarea&gt;

&lt;label for="select-id"&gt;Select Label:&lt;/label&gt;
&lt;select id="select-id"&gt;
    &lt;option&gt;Option 1&lt;/option&gt;
    &lt;option&gt;Option 2&lt;/option&gt;
&lt;/select&gt;

&lt;button type="button"&gt;Button Text&lt;/button&gt;</code></pre>
                </div>
                
                <h2>Tables</h2>
                
                <table>
                    <thead>
                        <tr>
                            <th>Component</th>
                            <th>Class Name</th>
                            <th>Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Intro Section</td>
                            <td><code>.intro-section</code></td>
                            <td>Highlighted introduction paragraphs</td>
                        </tr>
                        <tr>
                            <td>Info Callout</td>
                            <td><code>.callout.callout-info</code></td>
                            <td>General information boxes</td>
                        </tr>
                        <tr>
                            <td>Success Callout</td>
                            <td><code>.callout.callout-success</code></td>
                            <td>Success and positive feedback</td>
                        </tr>
                        <tr>
                            <td>Warning Callout</td>
                            <td><code>.callout.callout-warning</code></td>
                            <td>Warnings and cautions</td>
                        </tr>
                        <tr>
                            <td>Error Callout</td>
                            <td><code>.callout.callout-error</code></td>
                            <td>Errors and critical information</td>
                        </tr>
                    </tbody>
                </table>
                
                <h2>Lists</h2>
                
                <h3>Unordered List</h3>
                <ul>
                    <li>First item with <strong>bold emphasis</strong></li>
                    <li>Second item with <a href="#">a link</a></li>
                    <li>Third item with <code>inline code</code></li>
                    <li>Fourth item with regular text</li>
                </ul>
                
                <h3>Ordered List</h3>
                <ol>
                    <li>Step one of the process</li>
                    <li>Step two with detailed explanation</li>
                    <li>Step three to complete the task</li>
                    <li>Final step for verification</li>
                </ol>
                
                <h2>Scripture Quotes</h2>
                
                <p>Special components for Biblical content and quotations:</p>
                
                <h3>Standard Scripture Quote</h3>
                <div class="scripture-quote">
                    <blockquote>For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.</blockquote>
                    <cite>John 3:16 (NIV)</cite>
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="scripture-quote"&gt;
    &lt;blockquote&gt;For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.&lt;/blockquote&gt;
    &lt;cite&gt;John 3:16 (NIV)&lt;/cite&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h3>Compact Scripture Quote</h3>
                <div class="scripture-quote compact">
                    <blockquote>Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.</blockquote>
                    <cite>Joshua 1:9 (NIV)</cite>
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="scripture-quote compact"&gt;
    &lt;blockquote&gt;Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.&lt;/blockquote&gt;
    &lt;cite&gt;Joshua 1:9 (NIV)&lt;/cite&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Video Embeds</h2>
                
                <p>Responsive video embedding for external content:</p>
                
                <h3>Standard Video Embed</h3>
                <div class="video-embed">
                    <iframe src="https://www.youtube.com/embed/jGwO_UgTS7I" title="Bach - Air on the G String"></iframe>
                    <p class="video-caption">Bach's Air on the G String - Example of embedded video content</p>
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="video-embed"&gt;
    &lt;iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Video Title"&gt;&lt;/iframe&gt;
    &lt;p class="video-caption"&gt;Your video description here&lt;/p&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h3>Responsive Video Embed</h3>
                <div class="video-embed responsive">
                    <iframe src="https://www.youtube.com/embed/jGwO_UgTS7I" title="Bach - Air on the G String"></iframe>
                    <p class="video-caption">Responsive version that maintains 16:9 aspect ratio</p>
                </div>
                
                <div class="tab-content">
                    <strong>HTML:</strong>
                    <pre><code>&lt;div class="video-embed responsive"&gt;
    &lt;iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Video Title"&gt;&lt;/iframe&gt;
    &lt;p class="video-caption"&gt;Your video description here&lt;/p&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Interactive Form Elements</h2>
                
                <h3>Specialized Buttons</h3>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">
                    <button class="btn-commit">Save Changes</button>
                    <button class="btn-cancel">Cancel</button>
                    <button class="btn-abort">Delete</button>
                    <button class="btn-primary">Continue</button>
                    <button class="btn-secondary">Learn More</button>
                </div>
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin: 1rem 0;">
                    <button class="btn-commit" disabled>Save Changes</button>
                    <button class="btn-cancel" disabled>Cancel</button>
                    <button class="btn-abort" disabled>Delete</button>
                    <button class="btn-primary" disabled>Continue</button>
                    <button class="btn-secondary" disabled>Learn More</button>
                </div>
                
                <div class="tab-content">
                    <strong>Button HTML:</strong>
                    <pre><code>&lt;button class="btn-commit"&gt;Save Changes&lt;/button&gt;
&lt;button class="btn-cancel"&gt;Cancel&lt;/button&gt;
&lt;button class="btn-abort"&gt;Delete&lt;/button&gt;
&lt;button class="btn-primary"&gt;Continue&lt;/button&gt;
&lt;button class="btn-secondary"&gt;Learn More&lt;/button&gt;

&lt;!-- Disabled state --&gt;
&lt;button class="btn-commit" disabled&gt;Save Changes&lt;/button&gt;</code></pre>
                </div>
                
                <h3>Checkboxes</h3>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="check1" checked>
                    <label for="check1">I agree to the terms and conditions</label>
                </div>
                <div class="checkbox-wrapper">
                    <input type="checkbox" id="check2">
                    <label for="check2">Send me updates via email</label>
                </div>
                <div class="checkbox-wrapper disabled">
                    <input type="checkbox" id="check3" disabled>
                    <label for="check3">This option is disabled</label>
                </div>
                
                <div class="tab-content">
                    <strong>Checkbox HTML:</strong>
                    <pre><code>&lt;div class="checkbox-wrapper"&gt;
    &lt;input type="checkbox" id="check1" checked&gt;
    &lt;label for="check1"&gt;I agree to the terms and conditions&lt;/label&gt;
&lt;/div&gt;

&lt;!-- Disabled --&gt;
&lt;div class="checkbox-wrapper disabled"&gt;
    &lt;input type="checkbox" id="check3" disabled&gt;
    &lt;label for="check3"&gt;This option is disabled&lt;/label&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h3>Radio Buttons</h3>
                <div class="radio-wrapper">
                    <input type="radio" id="radio1" name="difficulty" value="easy" checked>
                    <label for="radio1">Easy</label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" id="radio2" name="difficulty" value="medium">
                    <label for="radio2">Medium</label>
                </div>
                <div class="radio-wrapper">
                    <input type="radio" id="radio3" name="difficulty" value="hard">
                    <label for="radio3">Hard</label>
                </div>
                <div class="radio-wrapper disabled">
                    <input type="radio" id="radio4" name="difficulty2" value="expert" disabled>
                    <label for="radio4">Expert (disabled)</label>
                </div>
                
                <div class="tab-content">
                    <strong>Radio Button HTML:</strong>
                    <pre><code>&lt;div class="radio-wrapper"&gt;
    &lt;input type="radio" id="radio1" name="difficulty" value="easy" checked&gt;
    &lt;label for="radio1"&gt;Easy&lt;/label&gt;
&lt;/div&gt;

&lt;!-- Disabled --&gt;
&lt;div class="radio-wrapper disabled"&gt;
    &lt;input type="radio" id="radio4" disabled&gt;
    &lt;label for="radio4"&gt;Expert (disabled)&lt;/label&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h3>Text Inputs</h3>
                <div class="input-wrapper">
                    <label for="input-small">Small Input:</label>
                    <input type="text" id="input-small" class="input-small" placeholder="Short text">
                </div>
                <div class="input-wrapper">
                    <label for="input-medium">Medium Input:</label>
                    <input type="text" id="input-medium" class="input-medium" placeholder="Medium length text">
                </div>
                <div class="input-wrapper">
                    <label for="input-large">Large Input:</label>
                    <input type="text" id="input-large" class="input-large" placeholder="Longer text input">
                </div>
                <div class="input-wrapper">
                    <label for="input-full">Full Width Input:</label>
                    <input type="text" id="input-full" class="input-full" placeholder="Full width input">
                </div>
                <div class="input-wrapper">
                    <label for="input-disabled">Disabled Input:</label>
                    <input type="text" id="input-disabled" class="input-medium" placeholder="Cannot edit this" disabled>
                </div>
                
                <div class="tab-content">
                    <strong>Text Input HTML:</strong>
                    <pre><code>&lt;div class="input-wrapper"&gt;
    &lt;label for="input-small"&gt;Small Input:&lt;/label&gt;
    &lt;input type="text" id="input-small" class="input-small" placeholder="Short text"&gt;
&lt;/div&gt;

&lt;!-- Available sizes: input-small, input-medium, input-large, input-full --&gt;
&lt;!-- Disabled state --&gt;
&lt;input type="text" class="input-medium" disabled&gt;</code></pre>
                </div>
                
                <h3>Custom Dropdowns</h3>
                <div class="select-wrapper">
                    <label for="select-small">Small Select:</label>
                    <select id="select-small" class="select-small">
                        <option>Choose option...</option>
                        <option>Genesis</option>
                        <option>Exodus</option>
                        <option>Leviticus</option>
                    </select>
                </div>
                <div class="select-wrapper">
                    <label for="select-medium">Medium Select:</label>
                    <select id="select-medium" class="select-medium">
                        <option>Choose difficulty...</option>
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                </div>
                <div class="select-wrapper">
                    <label for="select-disabled">Disabled Select:</label>
                    <select id="select-disabled" class="select-medium" disabled>
                        <option>Cannot change this</option>
                    </select>
                </div>
                
                <div class="tab-content">
                    <strong>Dropdown HTML:</strong>
                    <pre><code>&lt;div class="select-wrapper"&gt;
    &lt;label for="select-small"&gt;Small Select:&lt;/label&gt;
    &lt;select id="select-small" class="select-small"&gt;
        &lt;option&gt;Choose option...&lt;/option&gt;
        &lt;option&gt;Genesis&lt;/option&gt;
        &lt;option&gt;Exodus&lt;/option&gt;
    &lt;/select&gt;
&lt;/div&gt;

&lt;!-- Available sizes: select-small, select-medium, select-large, select-full --&gt;</code></pre>
                </div>
                
                <h3>Enhanced Textareas</h3>
                <div class="textarea-wrapper">
                    <label for="textarea-small">Small Textarea:</label>
                    <textarea id="textarea-small" class="textarea-small input-full" placeholder="Short notes..."></textarea>
                </div>
                <div class="textarea-wrapper">
                    <label for="textarea-medium">Medium Textarea:</label>
                    <textarea id="textarea-medium" class="textarea-medium input-full" placeholder="Study notes..."></textarea>
                </div>
                <div class="textarea-wrapper">
                    <label for="textarea-large">Large Textarea:</label>
                    <textarea id="textarea-large" class="textarea-large input-full" placeholder="Detailed commentary..."></textarea>
                </div>
                <div class="textarea-wrapper">
                    <label for="textarea-disabled">Disabled Textarea:</label>
                    <textarea id="textarea-disabled" class="textarea-medium input-full" placeholder="Cannot edit this" disabled></textarea>
                </div>
                
                <div class="tab-content">
                    <strong>Textarea HTML:</strong>
                    <pre><code>&lt;div class="textarea-wrapper"&gt;
    &lt;label for="textarea-medium"&gt;Study Notes:&lt;/label&gt;
    &lt;textarea id="textarea-medium" class="textarea-medium input-full" placeholder="Study notes..."&gt;&lt;/textarea&gt;
&lt;/div&gt;

&lt;!-- Available sizes: textarea-small, textarea-medium, textarea-large, textarea-auto --&gt;</code></pre>
                </div>
                
                <h3>Toggle Switches</h3>
                <div class="toggle-wrapper">
                    <div class="toggle-switch">
                        <input type="checkbox" id="toggle1" checked>
                        <span class="toggle-slider"></span>
                    </div>
                    <label for="toggle1">Enable notifications</label>
                </div>
                <div class="toggle-wrapper">
                    <div class="toggle-switch">
                        <input type="checkbox" id="toggle2">
                        <span class="toggle-slider"></span>
                    </div>
                    <label for="toggle2">Show hints during quiz</label>
                </div>
                <div class="toggle-wrapper disabled">
                    <div class="toggle-switch">
                        <input type="checkbox" id="toggle3" disabled>
                        <span class="toggle-slider"></span>
                    </div>
                    <label for="toggle3">Premium feature (disabled)</label>
                </div>
                
                <div class="tab-content">
                    <strong>Toggle Switch HTML:</strong>
                    <pre><code>&lt;div class="toggle-wrapper"&gt;
    &lt;div class="toggle-switch"&gt;
        &lt;input type="checkbox" id="toggle1" checked&gt;
        &lt;span class="toggle-slider"&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;label for="toggle1"&gt;Enable notifications&lt;/label&gt;
&lt;/div&gt;

&lt;!-- Disabled --&gt;
&lt;div class="toggle-wrapper disabled"&gt;
    &lt;div class="toggle-switch"&gt;
        &lt;input type="checkbox" id="toggle3" disabled&gt;
        &lt;span class="toggle-slider"&gt;&lt;/span&gt;
    &lt;/div&gt;
    &lt;label for="toggle3"&gt;Premium feature (disabled)&lt;/label&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Progress Bars</h2>
                
                <h3>Standard Progress Bars</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 65%"></div>
                    <div class="progress-text">65%</div>
                </div>
                
                <div class="progress-bar success">
                    <div class="progress-fill" style="width: 100%"></div>
                    <div class="progress-text">Complete!</div>
                </div>
                
                <div class="progress-bar warning">
                    <div class="progress-fill" style="width: 25%"></div>
                    <div class="progress-text">25%</div>
                </div>
                
                <div class="progress-bar danger">
                    <div class="progress-fill" style="width: 10%"></div>
                    <div class="progress-text">10%</div>
                </div>
                
                <h3>Thin Progress Bar</h3>
                <div class="progress-bar thin">
                    <div class="progress-fill" style="width: 45%"></div>
                </div>
                
                <h3>Reading Progress Example</h3>
                <div class="reading-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 73%"></div>
                        <div class="progress-text">Day 267</div>
                    </div>
                    <div class="progress-label">267 of 365 days</div>
                </div>
                
                <div class="tab-content">
                    <strong>Progress Bar HTML:</strong>
                    <pre><code>&lt;div class="progress-bar"&gt;
    &lt;div class="progress-fill" style="width: 65%"&gt;&lt;/div&gt;
    &lt;div class="progress-text"&gt;65%&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Variants: success, warning, danger --&gt;
&lt;div class="progress-bar success"&gt;
    &lt;div class="progress-fill" style="width: 100%"&gt;&lt;/div&gt;
    &lt;div class="progress-text"&gt;Complete!&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Thin version --&gt;
&lt;div class="progress-bar thin"&gt;
    &lt;div class="progress-fill" style="width: 45%"&gt;&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Reading progress with label --&gt;
&lt;div class="reading-progress"&gt;
    &lt;div class="progress-bar"&gt;
        &lt;div class="progress-fill" style="width: 73%"&gt;&lt;/div&gt;
        &lt;div class="progress-text"&gt;Day 267&lt;/div&gt;
    &lt;/div&gt;
    &lt;div class="progress-label"&gt;267 of 365 days&lt;/div&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Autocomplete/Typeahead</h2>
                
                <p>Smart text input with suggestions from predefined lists:</p>
                
                <div class="autocomplete-wrapper">
                    <label for="bible-book-input">Which Bible book? (try typing "gen", "matt", or "1 cor"):</label>
                    <input type="text" id="bible-book-input" class="autocomplete-input" placeholder="Type a Bible book name...">
                    <div class="autocomplete-dropdown"></div>
                </div>
                
                <div class="autocomplete-wrapper">
                    <label for="character-input">Biblical Character:</label>
                    <input type="text" id="character-input" class="autocomplete-input" placeholder="Start typing a name...">
                    <div class="autocomplete-dropdown"></div>
                </div>
                
                <div class="tab-content">
                    <strong>Autocomplete HTML:</strong>
                    <pre><code>&lt;div class="autocomplete-wrapper"&gt;
    &lt;label for="bible-book-input"&gt;Which Bible book?&lt;/label&gt;
    &lt;input type="text" id="bible-book-input" class="autocomplete-input" placeholder="Type a Bible book name..."&gt;
    &lt;div class="autocomplete-dropdown"&gt;&lt;/div&gt;
&lt;/div&gt;</code></pre>
                </div>
                
                <div class="callout callout-info">
                    <strong>Features:</strong> Type to search, use arrow keys to navigate, Enter to select, click to choose, Escape to close.
                </div>
                
                <h2>Badges & Tags</h2>
                
                <h3>Standard Badges</h3>
                <div style="margin: 1rem 0;">
                    <span class="badge badge-primary">Primary</span>
                    <span class="badge badge-success">Success</span>
                    <span class="badge badge-warning">Warning</span>
                    <span class="badge badge-danger">Danger</span>
                    <span class="badge badge-secondary">Secondary</span>
                </div>
                
                <h3>Large Badges</h3>
                <div style="margin: 1rem 0;">
                    <span class="badge badge-primary badge-large">Large Primary</span>
                    <span class="badge badge-success badge-large">Large Success</span>
                </div>
                
                <h3>Pill Badges</h3>
                <div style="margin: 1rem 0;">
                    <span class="badge badge-primary badge-pill">Pill Shape</span>
                    <span class="badge badge-warning badge-pill">Round Badge</span>
                </div>
                
                <h3>Biblical Study Badges</h3>
                <div style="margin: 1rem 0;">
                    <span class="badge badge-difficulty-beginner">Beginner</span>
                    <span class="badge badge-difficulty-intermediate">Intermediate</span>
                    <span class="badge badge-difficulty-advanced">Advanced</span>
                </div>
                <div style="margin: 1rem 0;">
                    <span class="badge badge-topic">Historical Context</span>
                    <span class="badge badge-topic">Theology</span>
                    <span class="badge badge-completed">Completed</span>
                </div>
                
                <div class="tab-content">
                    <strong>Badge HTML:</strong>
                    <pre><code>&lt;span class="badge badge-primary"&gt;Primary&lt;/span&gt;
&lt;span class="badge badge-success"&gt;Success&lt;/span&gt;
&lt;span class="badge badge-warning"&gt;Warning&lt;/span&gt;
&lt;span class="badge badge-danger"&gt;Danger&lt;/span&gt;

&lt;!-- Large badges --&gt;
&lt;span class="badge badge-primary badge-large"&gt;Large Primary&lt;/span&gt;

&lt;!-- Pill shape --&gt;
&lt;span class="badge badge-primary badge-pill"&gt;Pill Shape&lt;/span&gt;

&lt;!-- Biblical study specific --&gt;
&lt;span class="badge badge-difficulty-beginner"&gt;Beginner&lt;/span&gt;
&lt;span class="badge badge-topic"&gt;Historical Context&lt;/span&gt;
&lt;span class="badge badge-completed"&gt;Completed&lt;/span&gt;</code></pre>
                </div>
                
                <h2>Feedback Messages</h2>
                
                <div class="message message-success">
                    Correct! You successfully answered the question.
                </div>
                
                <div class="message message-error">
                    Incorrect answer. Please try again.
                </div>
                
                <div class="message message-warning">
                    Warning: You have 2 attempts remaining.
                </div>
                
                <div class="message message-info">
                    Hint: This event took place in the first century AD.
                </div>
                
                <div class="message message-success compact">
                    Quiz completed successfully!
                </div>
                
                <div class="tab-content">
                    <strong>Message HTML:</strong>
                    <pre><code>&lt;div class="message message-success"&gt;
    Correct! You successfully answered the question.
&lt;/div&gt;

&lt;div class="message message-error"&gt;
    Incorrect answer. Please try again.
&lt;/div&gt;

&lt;div class="message message-warning"&gt;
    Warning: You have 2 attempts remaining.
&lt;/div&gt;

&lt;div class="message message-info"&gt;
    Hint: This event took place in the first century AD.
&lt;/div&gt;

&lt;!-- Compact version --&gt;
&lt;div class="message message-success compact"&gt;
    Quiz completed successfully!
&lt;/div&gt;</code></pre>
                </div>
                
                <h2>Quiz Cards</h2>
                
                <p>Interactive quiz cards with flexible input types, hints, and feedback:</p>
                
                <h3>Multiple Choice Quiz Card</h3>
                <quiz-card question-id="q1" id="quizCard1" 
                           difficulty="easy" 
                           category="biblical-history" 
                           bible-books="Exodus" 
                           topics="ten-commandments,law" 
                           estimated-time="45">
                    <span slot="question">Which book of the Bible contains the Ten Commandments?</span>
                    
                    <div slot="answer-input">
                        <div class="radio-wrapper">
                            <input type="radio" id="q1-genesis" name="q1-answer" value="genesis">
                            <label for="q1-genesis">Genesis</label>
                        </div>
                        <div class="radio-wrapper">
                            <input type="radio" id="q1-exodus" name="q1-answer" value="exodus">
                            <label for="q1-exodus">Exodus</label>
                        </div>
                        <div class="radio-wrapper">
                            <input type="radio" id="q1-numbers" name="q1-answer" value="numbers">
                            <label for="q1-numbers">Numbers</label>
                        </div>
                        <div class="radio-wrapper">
                            <input type="radio" id="q1-deut" name="q1-answer" value="deuteronomy">
                            <label for="q1-deut">Deuteronomy</label>
                        </div>
                    </div>
                    
                    <span slot="correct-answer">Exodus</span>
                    
                    <div slot="explanation">
                        The Ten Commandments appear in <strong>Exodus 20:1-17</strong> and are repeated in Deuteronomy 5:4-21. 
                        They were given to Moses on Mount Sinai as part of the covenant between God and Israel.
                        <br><br>
                        <a href="#">Read more about the Ten Commandments →</a>
                    </div>
                </quiz-card>
                
                <div class="tab-content">
                    <strong>Multiple Choice HTML:</strong>
                    <pre><code>&lt;quiz-card question-id="q1" 
           difficulty="easy" 
           category="biblical-history" 
           bible-books="Exodus" 
           topics="ten-commandments,law"&gt;
    &lt;span slot="question"&gt;Which book contains the Ten Commandments?&lt;/span&gt;
    
    &lt;div slot="answer-input"&gt;
        &lt;div class="radio-wrapper"&gt;
            &lt;input type="radio" id="q1-exodus" name="q1-answer" value="exodus"&gt;
            &lt;label for="q1-exodus"&gt;Exodus&lt;/label&gt;
        &lt;/div&gt;
        &lt;!-- More options... --&gt;
    &lt;/div&gt;
    
    &lt;span slot="correct-answer"&gt;Exodus&lt;/span&gt;
    
    &lt;div slot="explanation"&gt;
        The Ten Commandments appear in Exodus 20:1-17.
        &lt;a href="#"&gt;Read more →&lt;/a&gt;
    &lt;/div&gt;
&lt;/quiz-card&gt;</code></pre>
                </div>
                
                <h3>Checkbox Quiz Card</h3>
                <quiz-card question-id="q2" id="quizCard2" 
                           difficulty="medium" 
                           category="theology" 
                           bible-books="Galatians" 
                           topics="fruits-of-spirit,holy-spirit" 
                           estimated-time="90">
                    <span slot="question">Select all the fruits of the Spirit mentioned in Galatians 5:22-23:</span>
                    
                    <div slot="answer-input">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="q2-love" value="love">
                            <label for="q2-love">Love</label>
                        </div>
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="q2-joy" value="joy">
                            <label for="q2-joy">Joy</label>
                        </div>
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="q2-peace" value="peace">
                            <label for="q2-peace">Peace</label>
                        </div>
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="q2-wisdom" value="wisdom">
                            <label for="q2-wisdom">Wisdom (not a fruit)</label>
                        </div>
                        <div class="checkbox-wrapper">
                            <input type="checkbox" id="q2-patience" value="patience">
                            <label for="q2-patience">Patience</label>
                        </div>
                    </div>
                    
                    <span slot="correct-answer">Love, Joy, Peace, Patience</span>
                    
                    <div slot="explanation">
                        The complete list includes: love, joy, peace, forbearance (patience), kindness, 
                        goodness, faithfulness, gentleness and self-control. Note that "wisdom" is not 
                        listed among the fruits of the Spirit.
                    </div>
                </quiz-card>
                
                <h3>Text Input Quiz Card</h3>
                <quiz-card question-id="q3" id="quizCard3" 
                           difficulty="medium" 
                           category="biblical-history" 
                           bible-books="1 Samuel" 
                           topics="kings,samuel,saul" 
                           estimated-time="60">
                    <span slot="question">Who was the first king of Israel?</span>
                    
                    <div slot="answer-input">
                        <div class="input-wrapper">
                            <input type="text" id="q3-answer" class="input-medium" placeholder="Type your answer...">
                        </div>
                    </div>
                    
                    <span slot="correct-answer">Saul</span>
                    
                    <div slot="explanation">
                        Saul was anointed as the first king of Israel by the prophet Samuel around 1020 BC. 
                        The story is found in 1 Samuel 9-10. Though he started well, Saul later disobeyed God 
                        and was eventually replaced by David.
                        <br><br>
                        <em>"So Samuel took a flask of olive oil and poured it on Saul's head and kissed him, 
                        saying, 'Has not the Lord anointed you ruler over his inheritance?'" - 1 Samuel 10:1</em>
                    </div>
                </quiz-card>
                
                <div class="tab-content">
                    <strong>Quiz Card Events:</strong>
                    <pre><code>// Listen for quiz events
const quizCard = document.querySelector('quiz-card');

quizCard.addEventListener('validate-answer', (e) => {
    // Check the user's answer and set result
    const isCorrect = checkAnswer(e.detail);
    quizCard.setValidationResult(isCorrect);
    
    // Optional: Mark wrong answers visually
    if (!isCorrect) {
        quizCard.markWrongAnswers('.wrong-selection');
    }
});

quizCard.addEventListener('answer-revealed', (e) => {
    console.log('Answer revealed:', e.detail);
    // Send to backend: questionId, correct, hadUserInput, timestamp
});

quizCard.addEventListener('next-question', (e) => {
    // Load next question or navigate
    loadNextQuestion();
});</code></pre>
                </div>
                
                <div class="callout callout-info">
                    <strong>Key Features:</strong>
                    <ul>
                        <li><strong>Visual Feedback:</strong> Green success, red error, blue info messages</li>
                        <li><strong>Flexible Input:</strong> Any HTML input type works in the answer-input slot</li>
                        <li><strong>Rich Explanations:</strong> Support for links, formatting, scripture quotes</li>
                        <li><strong>Smart Handling:</strong> Different feedback for correct/incorrect/no answer</li>
                        <li><strong>Metadata Support:</strong> Track difficulty, topics, Bible books, etc.</li>
                    </ul>
                </div>
                
                <h3>Quiz Card Metadata</h3>
                <p>Each quiz card supports metadata attributes for tracking and analytics:</p>
                
                <div class="tab-content">
                    <strong>Metadata Attributes:</strong>
                    <pre><code>&lt;quiz-card question-id="q1" 
           difficulty="easy|medium|hard" 
           category="biblical-history|theology|doctrine" 
           bible-books="Genesis,Exodus" 
           topics="creation,law,prophets" 
           estimated-time="60" 
           points="1"&gt;
    &lt;!-- Question content --&gt;
&lt;/quiz-card&gt;

// Metadata is included in events:
quizCard.addEventListener('answer-revealed', (e) => {
    console.log(e.detail.metadata);
    // {
    //   difficulty: "medium",
    //   topics: ["kings", "samuel"],
    //   bibleBooks: ["1 Samuel"],
    //   category: "biblical-history",
    //   estimatedTime: 60,
    //   points: 1
    // }
});</code></pre>
                </div>
                
                <h2>Hierarchical Tree Selector</h2>
                
                <p>Generic hierarchical tree selector for choosing items from organized data with smart grouping:</p>
                
                <h3>Default Example (Programming Languages)</h3>
                <hierarchical-tree-selector id="techSelector"></hierarchical-tree-selector>
                
                <h3>Custom Data Example (Bible Books)</h3>
                <hierarchical-tree-selector id="bibleSelector"
                    title="Select Bible Books"
                    data='{"Old Testament":{"Law":["Genesis","Exodus","Leviticus","Numbers","Deuteronomy"],"Historical":["Joshua","Judges","Ruth","1 Samuel","2 Samuel"],"Wisdom":["Job","Psalms","Proverbs","Ecclesiastes"]},"New Testament":{"Gospels":["Matthew","Mark","Luke","John"],"Letters":["Romans","1 Corinthians","Ephesians","Philippians"]}}'>
                </hierarchical-tree-selector>
                
                <h3>Simple Example (No Presets)</h3>
                <hierarchical-tree-selector id="simpleSelector"
                    title="Choose Categories" 
                    allow-presets="false"
                    data='{"Food":{"Fruits":["Apple","Banana","Orange"],"Vegetables":["Carrot","Broccoli","Spinach"]},"Beverages":{"Hot":["Coffee","Tea","Hot Chocolate"],"Cold":["Water","Juice","Soda"]}}'>
                </hierarchical-tree-selector>
                
                <div class="tab-content">
                    <strong>Tree Selector HTML:</strong>
                    <pre><code>&lt;!-- Default with demo data --&gt;
&lt;hierarchical-tree-selector&gt;&lt;/hierarchical-tree-selector&gt;

&lt;!-- Custom data and title --&gt;
&lt;hierarchical-tree-selector 
    title="Select Bible Books"
    data='{"Old Testament":{"Law":["Genesis","Exodus"]}}'&gt;
&lt;/hierarchical-tree-selector&gt;

&lt;!-- Disable preset buttons --&gt;
&lt;hierarchical-tree-selector 
    allow-presets="false"
    selected-items='["Apple","Banana"]'&gt;
&lt;/hierarchical-tree-selector&gt;

// Listen for selection changes
selector.addEventListener('selection-changed', (e) => {
    console.log('Selected items:', e.detail.selectedItems);
    console.log('Count:', e.detail.count);
});

// Programmatic control
selector.setSelectedItems(['JavaScript', 'Python']);
selector.setData({...}); // Update data structure
selector.getSelectedItems(); // Get current selection
selector.reset(); // Clear all selections</code></pre>
                </div>
                
                <div class="callout callout-info">
                    <strong>Tree Selector Features:</strong>
                    <ul>
                        <li><strong>Generic Data Structure:</strong> Works with any Group → Category → Items hierarchy</li>
                        <li><strong>Bulk Selection:</strong> Click groups/categories to select all items in that section</li>
                        <li><strong>Configurable:</strong> Custom title, data, preset buttons, initial selection</li>
                        <li><strong>Visual Feedback:</strong> Selected count, indeterminate states for partial selections</li>
                        <li><strong>Expandable Tree:</strong> Collapse/expand sections to save space</li>
                        <li><strong>Mobile Friendly:</strong> Responsive design that works on all screen sizes</li>
                    </ul>
                </div>
                
                <h2>Collapsible Sections</h2>
                
                <p>Collapsible sections for organizing content with clear previews and smooth animations:</p>
                
                <h3>Basic Examples</h3>
                
                <collapsible-section title="Game Settings" summary="Configure difficulty, time limits, and preferences" id="settingsSection">
                    <div class="input-wrapper">
                        <label for="difficulty">Difficulty Level:</label>
                        <select id="difficulty" class="select-medium">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                    <div class="input-wrapper">
                        <label for="timeLimit">Time Limit (minutes):</label>
                        <input type="number" id="timeLimit" class="input-small" value="10" min="1" max="60">
                    </div>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="hints" checked>
                        <label for="hints">Enable hints</label>
                    </div>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="sounds">
                        <label for="sounds">Enable sound effects</label>
                    </div>
                </collapsible-section>
                
                <collapsible-section title="Instructions" summary="How to play this game and scoring rules" expanded="true">
                    <div class="callout callout-info">
                        <strong>How to Play:</strong>
                        <ol>
                            <li>Select the Bible books you want to include</li>
                            <li>A random passage will be shown</li>
                            <li>Find the passage in your physical Bible</li>
                            <li>Use hints if you're stuck</li>
                        </ol>
                    </div>
                    <p>This game helps improve your Bible navigation skills by practicing with real passages from the books you choose.</p>
                </collapsible-section>
                
                <h3>Visual Variants</h3>
                
                <collapsible-section title="Card Style" summary="Elevated appearance with shadow" variant="card">
                    <p>This variant has a subtle shadow and elevated appearance, perfect for important sections or forms.</p>
                    <button class="btn-primary">Sample Action</button>
                </collapsible-section>
                
                <collapsible-section title="Flat Style" summary="Minimal styling for inline content" variant="flat">
                    <p>The flat variant has no background or border, just a clean line separator. Good for FAQ sections or documentation.</p>
                </collapsible-section>
                
                <collapsible-section title="Accent Style" summary="Left border accent for emphasis" variant="accent">
                    <p>This variant includes a colored left border to draw attention to important sections.</p>
                </collapsible-section>
                
                <h3>With Status & Count</h3>
                
                <collapsible-section title="Active Section" summary="Currently processing items" id="activeSection">
                    <p>This section has an active status indicator (green dot) to show it's currently active or processing.</p>
                    <div class="message message-success">
                        Processing completed successfully!
                    </div>
                </collapsible-section>
                
                <collapsible-section title="Selected Items" summary="View and manage your selections" id="itemsSection">
                    <p>This section shows a count badge indicating how many items are selected.</p>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="item1" checked>
                        <label for="item1">Genesis</label>
                    </div>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="item2" checked>
                        <label for="item2">Matthew</label>
                    </div>
                    <div class="checkbox-wrapper">
                        <input type="checkbox" id="item3">
                        <label for="item3">Psalms</label>
                    </div>
                </collapsible-section>
                
                <div class="tab-content">
                    <strong>Collapsible Section HTML:</strong>
                    <pre><code>&lt;!-- Basic section --&gt;
&lt;collapsible-section title="Settings" summary="Configure your preferences"&gt;
    &lt;!-- Your content here --&gt;
&lt;/collapsible-section&gt;

&lt;!-- Expanded by default --&gt;
&lt;collapsible-section title="Instructions" expanded="true"&gt;
    &lt;p&gt;Game instructions...&lt;/p&gt;
&lt;/collapsible-section&gt;

&lt;!-- Different visual styles --&gt;
&lt;collapsible-section title="Card" variant="card"&gt;...&lt;/collapsible-section&gt;
&lt;collapsible-section title="Flat" variant="flat"&gt;...&lt;/collapsible-section&gt;
&lt;collapsible-section title="Accent" variant="accent"&gt;...&lt;/collapsible-section&gt;

// JavaScript control
const section = document.querySelector('collapsible-section');

section.addEventListener('toggle', (e) => {
    console.log('Section toggled:', e.detail.expanded);
});

section.expand();       // Programmatically expand
section.collapse();     // Programmatically collapse
section.setCount(5);    // Show count badge
section.setStatus('active'); // Set status indicator</code></pre>
                </div>
                
                <div class="callout callout-info">
                    <strong>Collapsible Section Features:</strong>
                    <ul>
                        <li><strong>Clear Preview:</strong> Summary text shows what's inside when collapsed</li>
                        <li><strong>Independent Operation:</strong> Multiple sections can be open simultaneously</li>
                        <li><strong>Visual Variants:</strong> Card, flat, and accent styling options</li>
                        <li><strong>Status Indicators:</strong> Color-coded dots for active/warning/error states</li>
                        <li><strong>Count Badges:</strong> Show number of items or selections</li>
                        <li><strong>Smooth Animations:</strong> Smooth expand/collapse with content fade-in</li>
                        <li><strong>Accessible:</strong> Keyboard navigation and proper ARIA attributes</li>
                    </ul>
                </div>
                
                <h2>Available CSS Classes</h2>
                
                <p>Here's a quick reference of all available CSS classes:</p>
                
                <table>
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Purpose</th>
                            <th>Usage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>.intro-section</code></td>
                            <td>Highlighted introduction boxes</td>
                            <td>Wrap important intro content</td>
                        </tr>
                        <tr>
                            <td><code>.callout</code></td>
                            <td>Base callout styling</td>
                            <td>Always combine with specific type</td>
                        </tr>
                        <tr>
                            <td><code>.callout-info</code></td>
                            <td>Blue information callouts</td>
                            <td>General tips and information</td>
                        </tr>
                        <tr>
                            <td><code>.callout-success</code></td>
                            <td>Green success callouts</td>
                            <td>Positive feedback, completed actions</td>
                        </tr>
                        <tr>
                            <td><code>.callout-warning</code></td>
                            <td>Orange warning callouts</td>
                            <td>Important cautions, potential issues</td>
                        </tr>
                        <tr>
                            <td><code>.callout-error</code></td>
                            <td>Red error callouts</td>
                            <td>Errors, critical information</td>
                        </tr>
                        <tr>
                            <td><code>.content-area</code></td>
                            <td>Content width optimization</td>
                            <td>Wrap main page content for better readability</td>
                        </tr>
                        <tr>
                            <td><code>.code-tabs</code></td>
                            <td>Code example containers</td>
                            <td>Group multiple code examples</td>
                        </tr>
                        <tr>
                            <td><code>.tab-content</code></td>
                            <td>Individual code examples</td>
                            <td>Contains labeled code blocks</td>
                        </tr>
                        <tr>
                            <td><code>.scripture-quote</code></td>
                            <td>Biblical quotations with citation</td>
                            <td>Styled blockquotes for scripture passages</td>
                        </tr>
                        <tr>
                            <td><code>.scripture-quote.compact</code></td>
                            <td>Smaller scripture quotes</td>
                            <td>More compact version for shorter verses</td>
                        </tr>
                        <tr>
                            <td><code>.video-embed</code></td>
                            <td>Video embedding container</td>
                            <td>Contains iframe and caption for videos</td>
                        </tr>
                        <tr>
                            <td><code>.video-embed.responsive</code></td>
                            <td>Responsive video container</td>
                            <td>Maintains 16:9 aspect ratio on all screen sizes</td>
                        </tr>
                    </tbody>
                </table>
                
                <div class="callout callout-info">
                    <strong>Usage Note:</strong> All these components are automatically styled by the global CSS. Simply use the appropriate HTML elements and CSS classes to achieve consistent styling throughout your application.
                </div>
                
                <div class="tab-content">
                    <strong>Content Area Wrapper:</strong>
                    <pre><code>&lt;div class="content-area"&gt;
    &lt;!-- Your page content goes here --&gt;
    &lt;h1&gt;Page Title&lt;/h1&gt;
    &lt;p&gt;Page content...&lt;/p&gt;
&lt;/div&gt;</code></pre>
                </div>
            </div>
        `;

        // Generate TOC from headings and add to right sidebar
        const toc = generateTOC(this);
        const sidebar = document.createElement('div');
        sidebar.setAttribute('slot', 'right');
        sidebar.appendChild(toc);

        // Inject sidebar into layout
        layout.appendChild(sidebar);

        // Make toggle switches interactive
        this.setupToggleSwitches();
        
        // Setup autocomplete functionality
        this.setupAutocomplete();
        
        // Setup quiz cards
        this.setupQuizCards();
        
        // Setup bible book selector
        this.setupBibleSelector();
        
        // Setup collapsible sections
        this.setupCollapsibleSections();
    }

    setupToggleSwitches() {
        // Add click handlers to toggle switches
        this.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', function() {
                // The CSS handles the visual state change automatically
                // This is where you could add custom logic if needed
                console.log(`Toggle ${this.id} is now: ${this.checked ? 'ON' : 'OFF'}`);
            });
        });

        // Make the wrapper clickable too (better UX)
        this.querySelectorAll('.toggle-wrapper').forEach(wrapper => {
            if (!wrapper.classList.contains('disabled')) {
                wrapper.addEventListener('click', function(e) {
                    // Only handle clicks on the wrapper itself, not the input
                    if (e.target === this || e.target.classList.contains('toggle-slider')) {
                        const toggle = this.querySelector('input[type="checkbox"]');
                        if (toggle && !toggle.disabled) {
                            toggle.checked = !toggle.checked;
                            // Trigger change event
                            toggle.dispatchEvent(new Event('change'));
                        }
                    }
                });
            }
        });
    }

    setupAutocomplete() {
        // Bible books data for autocomplete
        const bibleBooks = [
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
            '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
            'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
            'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
            'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
            'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
            'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
            'Matthew', 'Mark', 'Luke', 'John', 'Acts',
            'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
            'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
            '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
            '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
            'Jude', 'Revelation'
        ];

        // Setup autocomplete for each autocomplete input
        this.querySelectorAll('.autocomplete-wrapper').forEach(wrapper => {
            const input = wrapper.querySelector('.autocomplete-input');
            const dropdown = wrapper.querySelector('.autocomplete-dropdown');
            let highlightedIndex = -1;

            // Filter and display suggestions
            function showSuggestions(query) {
                if (query.length === 0) {
                    dropdown.classList.remove('show');
                    return;
                }

                const filtered = bibleBooks.filter(book => 
                    book.toLowerCase().includes(query.toLowerCase())
                );

                if (filtered.length === 0) {
                    dropdown.innerHTML = '<div class="autocomplete-no-results">No matches found</div>';
                    dropdown.classList.add('show');
                    highlightedIndex = -1;
                    return;
                }

                dropdown.innerHTML = filtered.map((book, index) => {
                    const highlighted = book.replace(
                        new RegExp(`(${query})`, 'gi'),
                        '<span class="autocomplete-match">$1</span>'
                    );
                    return `<div class="autocomplete-option" data-value="${book}" data-index="${index}">${highlighted}</div>`;
                }).join('');

                dropdown.classList.add('show');
                highlightedIndex = -1;
            }

            // Handle input changes
            input.addEventListener('input', (e) => {
                showSuggestions(e.target.value);
            });

            // Handle keyboard navigation
            input.addEventListener('keydown', (e) => {
                const options = dropdown.querySelectorAll('.autocomplete-option');
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    highlightedIndex = Math.min(highlightedIndex + 1, options.length - 1);
                    updateHighlight(options);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    highlightedIndex = Math.max(highlightedIndex - 1, -1);
                    updateHighlight(options);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (highlightedIndex >= 0 && options[highlightedIndex]) {
                        selectOption(options[highlightedIndex]);
                    }
                } else if (e.key === 'Escape') {
                    dropdown.classList.remove('show');
                    highlightedIndex = -1;
                }
            });

            // Handle option selection
            dropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('autocomplete-option')) {
                    selectOption(e.target);
                }
            });

            // Update highlighting
            function updateHighlight(options) {
                options.forEach((option, index) => {
                    option.classList.toggle('highlighted', index === highlightedIndex);
                });
            }

            // Select an option
            function selectOption(option) {
                input.value = option.dataset.value;
                dropdown.classList.remove('show');
                highlightedIndex = -1;
                // Trigger change event for form handling
                input.dispatchEvent(new Event('change'));
            }

            // Hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    dropdown.classList.remove('show');
                    highlightedIndex = -1;
                }
            });
        });
    }
    
    setupQuizCards() {
        // Setup validation for quiz card demos
        const quizCard1 = this.querySelector('#quizCard1');
        const quizCard2 = this.querySelector('#quizCard2');
        const quizCard3 = this.querySelector('#quizCard3');
        
        // Multiple choice quiz validation
        if (quizCard1) {
            quizCard1.addEventListener('validate-answer', (e) => {
                const selected = quizCard1.querySelector('input[name="q1-answer"]:checked');
                const isCorrect = selected && selected.value === 'exodus';
                
                quizCard1.setValidationResult(isCorrect);
                
                if (!isCorrect && selected) {
                    // Mark wrong answer
                    quizCard1.markWrongAnswers(`input[name="q1-answer"]:checked`);
                }
                
                if (isCorrect && selected) {
                    // Highlight correct answer
                    quizCard1.highlightCorrectAnswer(`input[value="exodus"]`);
                }
            });
            
            quizCard1.addEventListener('answer-revealed', (e) => {
                console.log('Quiz 1 answer revealed:', e.detail);
            });
            
            quizCard1.addEventListener('next-question', () => {
                console.log('Next question requested for quiz 1');
            });
        }
        
        // Checkbox quiz validation
        if (quizCard2) {
            quizCard2.addEventListener('validate-answer', (e) => {
                const checked = Array.from(quizCard2.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.value);
                const correct = ['love', 'joy', 'peace', 'patience'];
                const isCorrect = correct.length === checked.length && 
                    correct.every(fruit => checked.includes(fruit));
                
                quizCard2.setValidationResult(isCorrect);
                
                if (!isCorrect) {
                    // Mark wrong selections
                    quizCard2.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                        if (cb.checked && !correct.includes(cb.value)) {
                            // Wrong selection
                            quizCard2.markWrongAnswers(`input[value="${cb.value}"]`);
                        } else if (!cb.checked && correct.includes(cb.value)) {
                            // Missed correct answer
                            const wrapper = cb.closest('.checkbox-wrapper');
                            wrapper.style.background = 'rgba(46, 160, 67, 0.1)';
                            wrapper.style.border = '1px solid rgba(46, 160, 67, 0.3)';
                        }
                    });
                }
                
                if (isCorrect) {
                    // Highlight all correct answers
                    correct.forEach(value => {
                        quizCard2.highlightCorrectAnswer(`input[value="${value}"]`);
                    });
                }
            });
        }
        
        // Text input quiz validation
        if (quizCard3) {
            const input = quizCard3.querySelector('#q3-answer');
            
            // Validation
            quizCard3.addEventListener('validate-answer', (e) => {
                const answer = input.value.trim().toLowerCase();
                const isCorrect = answer === 'saul';
                
                quizCard3.setValidationResult(isCorrect);
                
                if (!isCorrect && answer) {
                    input.style.color = 'var(--error-color)';
                    input.style.textDecoration = 'line-through';
                } else if (isCorrect) {
                    input.style.color = 'var(--success-color)';
                    input.style.background = 'rgba(46, 160, 67, 0.1)';
                }
            });
        }
        
        // Log all quiz events for demo purposes
        this.querySelectorAll('quiz-card').forEach(card => {
            card.addEventListener('answer-revealed', (e) => {
                console.log('Answer revealed:', e.detail);
            });
            
            card.addEventListener('next-question', (e) => {
                console.log('Next question requested:', e.detail);
            });
        });
    }
    
    setupBibleSelector() {
        const bibleSelector = this.querySelector('#bibleSelector');
        
        if (bibleSelector) {
            // Log selection changes for demo
            bibleSelector.addEventListener('selection-changed', (e) => {
                console.log('Bible books selected:', e.detail.selectedBooks);
                console.log('Total count:', e.detail.count);
                
                // You could update UI here to show selected books
                // For demo purposes, just log to console
            });
        }
    }
    
    setupCollapsibleSections() {
        // Set up status and count for demo sections
        const activeSection = this.querySelector('#activeSection');
        const itemsSection = this.querySelector('#itemsSection');
        
        if (activeSection) {
            activeSection.setStatus('active');
            
            activeSection.addEventListener('toggle', (e) => {
                console.log('Active section toggled:', e.detail.expanded);
            });
        }
        
        if (itemsSection) {
            // Count checked checkboxes
            const updateItemCount = () => {
                const checkedItems = itemsSection.querySelectorAll('input[type="checkbox"]:checked');
                itemsSection.setCount(checkedItems.length);
            };
            
            // Initial count
            updateItemCount();
            
            // Update count when checkboxes change
            itemsSection.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    updateItemCount();
                }
            });
        }
        
        // Log all section toggle events for demo
        this.querySelectorAll('collapsible-section').forEach(section => {
            section.addEventListener('toggle', (e) => {
                console.log(`Section "${e.detail.title}" ${e.detail.expanded ? 'expanded' : 'collapsed'}`);
            });
        });
    }
}

customElements.define('components-gallery', ComponentsGallery);
