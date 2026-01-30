let lastMobileClick = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded!");
    
    // MOBILE DROPDOWN
    function handleMobileDropdowns() {
        if (window.innerWidth < 992) { // MOBILE
            console.log("Mobile mode: Enabling click-based dropdowns");
            
            document.querySelectorAll('.dropdown-menu .dropdown-toggle').forEach(toggle => {
                if (!toggle.hasAttribute('data-bs-toggle-original')) {
                    toggle.setAttribute('data-bs-toggle-original', toggle.getAttribute('data-bs-toggle') || '');
                }
                
                toggle.setAttribute('data-bs-toggle', '');
                
                toggle.addEventListener('click', handleMobileSubmenuClick);
            });
        } else { // DESKTOP
            console.log("Desktop mode: Restoring hover dropdowns");
            
            document.querySelectorAll('.dropdown-menu .dropdown-toggle').forEach(toggle => {
                toggle.removeEventListener('click', handleMobileSubmenuClick);
                
                const originalToggle = toggle.getAttribute('data-bs-toggle-original');
                if (originalToggle) {
                    toggle.setAttribute('data-bs-toggle', originalToggle);
                } else {
                    toggle.setAttribute('data-bs-toggle', 'dropdown');
                }
            });
        }
    }
    

function handleMobileSubmenuClick(e) {
    const now = Date.now();
    
    if (now - lastMobileClick < 300) {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
    lastMobileClick = now;
    
    console.log("Mobile submenu clicked!");
    
    e.preventDefault();
    e.stopPropagation();
    
    const toggle = this;
    const submenu = toggle.nextElementSibling;
    
    if (!submenu || !submenu.classList.contains('dropdown-menu')) {
        return;
    }
    
    const shouldShow = !submenu.classList.contains('show');
    
    const parentMenu = toggle.closest('.dropdown-menu');
    if (parentMenu) {
        parentMenu.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            if (menu !== submenu) {
                menu.classList.remove('show');
                const otherToggle = menu.previousElementSibling;
                if (otherToggle && otherToggle.classList.contains('dropdown-toggle')) {
                    otherToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
    
    if (shouldShow) {
        submenu.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
    } else {
        submenu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
    }
}
    
    // Initialize and handle resize
    handleMobileDropdowns();
    window.addEventListener('resize', handleMobileDropdowns);
    
    // Quiz toggle functionality - SIMPLE VERSION
    document.querySelectorAll('.quiz-toggle').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Find the answer (next sibling)
            let answer = this.nextElementSibling;
            
            // If answer has display: none OR no display set
            if (answer.style.display === 'none' || !answer.style.display) {
                // Show answer
                answer.style.display = 'block';
                
                // Toggle button text
                this.textContent = 'Hide Answer';
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-outline-secondary');
            } else {
                // Hide answer
                answer.style.display = 'none';
                
                // Toggle button text
                this.textContent = 'Reveal Answer';
                this.classList.remove('btn-outline-secondary');
                this.classList.add('btn-outline-primary');
            }
        });
    });
    
    // Table responsiveness
    function makeTablesResponsive() {
        document.querySelectorAll('table').forEach(table => {
            if (window.innerWidth < 768) {
                const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
                table.querySelectorAll('tbody tr').forEach(row => {
                    Array.from(row.querySelectorAll('td')).forEach((td, index) => {
                        if (headers[index]) {
                            td.setAttribute('data-label', headers[index]);
                        }
                    });
                });
            }
        });
    }
    
    makeTablesResponsive();
    window.addEventListener('resize', makeTablesResponsive);
});

// ==================== CALCULATOR THINGY OR WHATEVER ====================

let calcDisplay = document.getElementById('calcDisplay');
let currentInput = '0';
let operator = '';
let previousInput = '';

// Update display
function updateDisplay() {
    calcDisplay.value = currentInput;
}

// Append number or operator
function appendToCalc(value) {
    if (currentInput === '0' || currentInput === 'Error') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

// Clear calculator
function clearCalc() {
    currentInput = '0';
    operator = '';
    previousInput = '';
    updateDisplay();
}

// Backspace
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Perform calculation
function calculate() {
    try {
        let expression = currentInput.replace(/×/g, '*');
        
        currentInput = new Function('return ' + expression)();
        
        if (!isFinite(currentInput)) {
            currentInput = 'Error';
        } else {
            currentInput = parseFloat(currentInput.toFixed(10)).toString();
        }
    } catch (error) {
        currentInput = 'Error';
    }
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(e) {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendToCalc(key);
    } else if (key === '.') {
        appendToCalc('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToCalc(key === '*' ? '×' : key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Escape' || key === 'Delete') {
        clearCalc();
    } else if (key === 'Backspace') {
        backspace();
    }
});

// Initialize display
updateDisplay();