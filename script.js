async function getCountryInfo(event) {
    event.preventDefault(); 

    const countryName = document.getElementById("countryInput").value.trim(); 
    const resultSection = document.getElementById("result"); 
    const bordersSection = document.getElementById("borders"); 
    const countryFlag = document.getElementById("country-flag"); 

    if (!countryName) { 
        resultSection.innerHTML = "<p style='color:red;'>Please enter a country name.</p>";
        countryFlag.src = "";
        bordersSection.innerHTML = ""; 
        return; 
    }

    try {
        
        let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error("Country not found"); 

        let [country] = await response.json(); 

        
        const { name, capital, population, region, flags, borders } = country;

        
        resultSection.innerHTML = `
            <strong>${name.common}</strong><br>
            <strong>Capital:</strong> ${capital ? capital[0] : "N/A"}<br>
            <strong>Population:</strong> ${population.toLocaleString()}<br>
            <strong>Region:</strong> ${region}
        `;
        countryFlag.src = flags.png; 

        
        if (borders && borders.length > 0) {
            
            const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`);
            const borderCountries = await borderResponse.json();

            bordersSection.innerHTML = ""; 
            borderCountries.forEach(border => {
                bordersSection.innerHTML += `
                    <article>
                        <p>${border.name.common}</p>
                        <img src="${border.flags.png}" class="flag" alt="${border.name.common} flag">
                    </article>
                `;
            });
        } else {
            bordersSection.innerHTML = "<p>No bordering countries.</p>"; 
        }

    } catch (error) {
        
        resultSection.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        countryFlag.src = ""; 
        bordersSection.innerHTML = "";
    }
}
