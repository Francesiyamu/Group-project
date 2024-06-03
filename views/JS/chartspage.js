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
                    backgroundColor: ['#ff9992', '#85508b'], // Change these colors
                    borderColor: ['#161538'], 
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                                                    
                            color: '#161538b',
                            boxWidth: 60,
                            boxHeight: 20, 
                            font: {
                                size: 20 
                            }
                        }
                    }
                }
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
                backgroundColor: ['#ff9992', '#85508b'], 
                borderColor: ['#161538'], 
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#161538', 
                            boxWidth: 60, 
                            boxHeight: 20, 
                            font: {
                                size: 20 
                            }
                    }
                }
            }
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
    //console.log('chartpage binnekomende data omzet dit jaar /:', data);
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    let omzet = Array(12).fill(0); // Initialize an array
    data.forEach(item => {
        omzet[item.month - 1] = item.total;
    });
    const ctx = document.getElementById('myChart-omzet');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Omzet',
                data: omzet, 
                borderWidth: 2,
                borderColor: ['#161538'],
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {                   
                            color: '#161538',
                            boxWidth: 60,
                            boxHeight: 20,
                            font: {
                                size: 20 
                            }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#161538', 
                        font: {
                            size: 14, 
                        }
                    }
                },
                y: {
                    ticks: {
                        color: '#161538', 
                        font: {
                            size: 14, 
                        }
                    }
                }
            }
        }
    });

    // Calculate the total of all months
    const totalOmzet = omzet.reduce((a, b) => a + b, 0);
    console.log('totalOmzet:', totalOmzet);

    // Select the total element and set its text content to the total
    const totalElement = document.getElementById('totalOmzet');
    totalElement.textContent = `De totale omzet dit jaar bedraagt: ${totalOmzet} euro`;

})
.catch(error => {
    console.error('Error:', error);
});

// Totaal v. kosten dit jaar--------------------------------
fetch('/api/kosten')
.then(response => response.json())
.then(data => {
    console.log('kosten dit jaar /:', data);
    const months = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];
    let kosten = Array(12).fill(0); // Initialize an array
    data.forEach(item => {
        kosten[item.month - 1] = item.total;
    });
    const ctx = document.getElementById('myChart-kosten');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Kosten',
                data: kosten, 
                borderWidth: 2,
                borderColor: ['#161538'],
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#161538', 
                        boxWidth: 60, 
                        boxHeight: 20, 
                        font: {
                            size: 20
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#161538', 
                        font: {
                            size: 14, 
                        }
                    }
                },
                y: {
                    ticks: {
                        color: '#161538', 
                        font: {
                            size: 14, 
                        }
                    }
                }
            }
        }
    });

    // Calculate the total of all months
    const totalKosten = kosten.reduce((a, b) => a + b, 0);
    console.log('totalKosten:', totalKosten);

    // Select the total element and set its text content to the total
    const totalElement = document.getElementById('totalKosten');
    totalElement.textContent +=  `De totale kosten dit jaar bedragen : ${totalKosten} euro`;

});
