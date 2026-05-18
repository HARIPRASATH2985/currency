const dropList = document.querySelectorAll("select");
const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const getButton = document.querySelector("#convert-btn");
const swapButton = document.querySelector("#swap-btn");
const amountInput = document.querySelector("#amount");
const rateInfo = document.querySelector("#rate-info");
const finalResult = document.querySelector("#final-result");

// Free public API for exchange rates (updates daily)
const API_URL = "https://open.er-api.com/v6/latest/"; 

// Comprehensive list of global currency codes
const currencies = [
    "USD", "EUR", "GBP", "INR", "AUD", "CAD", "SGD", "CHF", "MYR", "JPY", 
    "CNY", "NZD", "THB", "HUF", "AED", "HKD", "MXN", "ZAR", "PHP", "SEK", 
    "IDR", "SAR", "BRL", "TRY", "KES", "KRW", "EGP", "IQD", "NOK", "KWD", 
    "RUB", "DKK", "PKR", "ILS", "PLN", "QAR", "OMR", "COP", "CLP", "TWD", 
    "ARS", "CZK", "VND", "MAD", "JOD", "BHD", "XOF", "LKR", "UAH", "NGN", 
    "TND", "UGX", "RON", "BDT", "PEN", "GEL", "XAF", "FJD", "VEF", "VES", 
    "BYN", "HRK", "UZS", "BGN", "DZD", "IRR", "DOP", "ISK", "CRC", "SYP", 
    "LYD", "JMD", "MUR", "GHS", "AOA", "UYU", "AFN", "LBP", "XPF", "TTD", 
    "TZS", "ALL", "XCD", "GTQ", "NPR", "BOB", "ZWD", "BBD", "CUC", "LAK", 
    "BND", "BWP", "HNL", "PYG", "ETB", "NAD", "PGK", "SDG", "MOP", "NIO", 
    "BMD", "KZT", "PAB", "BAM", "GYD", "YER", "MGA", "AWG", "BIF", "RWF", 
    "BTN", "KYD", "BZD", "LSL", "MZN", "SZL", "TJS", "AMD", "WST", "ZMW", 
    "MNT", "KGS", "CVE", "DJF", "MDL", "GMD", "HTG", "RSD", "KMF", "SLL", 
    "SOS", "CDF", "VUV", "GNF", "MWK", "MRO", "ANG", "MVR", "TMT", "STN", 
    "SRD", "SCR", "GIP", "FKP", "SHP", "GGP", "IMP", "JEP"
];

// Populate the select dropdowns with currency options
for (let i = 0; i < dropList.length; i++) {
    for (let currency_code of currencies) {
        // Set default options to USD for "From" and EUR for "To"
        let selected = i == 0 ? (currency_code == "USD" ? "selected" : "") : (currency_code == "EUR" ? "selected" : "");
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
}

// Handle swap button logic
swapButton.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    getExchangeRate(); // Refresh the conversion after swapping
});

// Trigger conversion on button click
getButton.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});

// Trigger conversion when pressing 'Enter' in the input field
amountInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        getExchangeRate();
    }
});

// Run initial conversion when the page loads
window.addEventListener("load", () => {
    getExchangeRate();
});

// Core function to fetch rates and calculate
async function getExchangeRate() {
    let amountVal = parseFloat(amountInput.value);
    
    // Fallback if input is empty or invalid
    if (isNaN(amountVal) || amountVal <= 0) {
        amountInput.value = "1";
        amountVal = 1;
    }

    // Indicate loading state
    rateInfo.innerText = "Fetching real-time rates...";
    finalResult.innerText = "Wait...";
    
    try {
        let response = await fetch(`${API_URL}${fromCurrency.value}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        let result = await response.json();
        let exchangeRate = result.rates[toCurrency.value];
        let totalExRate = (amountVal * exchangeRate).toFixed(2);
        
        // Format the rate info elegantly
        rateInfo.innerText = `1 ${fromCurrency.value} = ${exchangeRate.toFixed(4)} ${toCurrency.value}`;
        
        // Add a slight animation effect for the new result
        finalResult.style.opacity = 0;
        setTimeout(() => {
            finalResult.innerText = `${totalExRate} ${toCurrency.value}`;
            finalResult.style.opacity = 1;
            finalResult.style.transition = "opacity 0.3s ease";
        }, 150);
        
    } catch (error) {
        rateInfo.innerText = "Something went wrong. Please check your connection.";
        finalResult.innerText = "Error";
        console.error("Failed to fetch exchange rates:", error);
    }
}
