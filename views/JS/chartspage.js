console.log('Charts page loaded');
// LEVENRANCIERS BETAALD VS OPEN--------------------------------
fetch('/api/levfacturen')
    .then(response => response.json())
    .then(data => {
        
        const levfacturen = data; 
        console.log('data uit db facturen:', levfacturen);
        let betaaldTeller = 0;
        let OpenstaandTeller = 0;  

        levfacturen.forEach(factuur => {
            if (factuur.statusBetaling === 'Betaald') {
                betaaldTeller++;
            } else if (factuur.statusBetaling === 'Openstaand') {
                OpenstaandTeller++;
            }
            else {
                console.error('Onbekende status betaling:', factuur.statusBetaling);
            }
        });

        // Your chart code here
        const ctx = document.getElementById('myChart-lev');

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Betaald', 'Niet betaald'],
                datasets: [{
                    label: '',
                    data: [betaaldTeller, OpenstaandTeller],
                    borderWidth: 1
                }]
            }
        });
    })
    .catch(error => {
        // Handle any errors here
        console.error('Error:', error);
    });
// KLANTEN BETAALD VS OPEN--------------------------------
fetch('/api/klantfacturen')
.then(response => response.json())
.then(data => {
    
    const klantfacturen = data; 
    console.log('data uit db klanten:', klantfacturen);
    let betaaldTeller = 0;
    let OpenstaandTeller = 0;  

    klantfacturen.forEach(klantfactuur => {
        if (klantfactuur.statusBetaling === 'Betaald') {
            betaaldTeller++;
        } else if (klantfactuur.statusBetaling === 'Openstaand') {
            OpenstaandTeller++;
        }
        else {
            console.error('Onbekende status betaling:', factuur.statusBetaling);
        }
        
    });

    // Your chart code here
    const ctx = document.getElementById('myChart-klant');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Betaald', 'Niet betaald'],
            datasets: [{
                label: '',
                data: [betaaldTeller, OpenstaandTeller],
                borderWidth: 1
            }]
        }
    });
})
.catch(error => {
    // Handle any errors here
    console.error('Error:', error);
});

// OMZET(totaal bedrag van de klantfacturen)--------------------------------
fetch('/api/omzet-klanten')
.then(response => response.json())
.then(data => {
    console.log('chartpage binnekomende data omzet dit jaar /:', data);
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    let omzet = Array(12).fill(0); // Initialize an array of 12 elements to 0
    data.forEach(item => {
        omzet[item.month - 1] = item.total; // Update the elements for which you have data
    });
    const ctx = document.getElementById('myChart-omzet');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months, // Use the months array here
            datasets: [{
                label: 'Omzet',
                data: omzet, // Use the updated omzet array here
                borderWidth: 1
            }]
        }
    });

    // Calculate the total of all months
    const total = omzet.reduce((a, b) => a + b, 0);

    // Select the total element and set its text content to the total
    const totalElement = document.getElementById('total');
    totalElement.textContent +=  `De totale omzet dit jaar bedraagt : ${total} euro`;
})
.catch(error => {
    console.error('Error:', error);
});