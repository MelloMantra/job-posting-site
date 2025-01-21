document.addEventListener("DOMContentLoaded", async function () {
    var data;
    
    try {
        const response = await fetch('../api/user/getApplications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (response.ok) {
            data = await response.json();
            console.log(data);
        } else {
            console.log(`Error: ${response.status} ${response.statusText}`);
            alert("Internal server error.");
        }
    } catch (err) {
        console.error('Error Querying Database:', err);
        alert('Error Querying Database');
    }
});

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
}

/* 
data.applications will contain an array of JSON objects with the following structure:
{
    address: "1234 Place Lane, City, AB"
    companyName: "Name of company"
    created_at: "2025-01-20T07:00:00.000Z" //you may want to use the formatdate on this, since it'll return the date looking a lot prettier (or splice at T)
    estimatedPay: 102 //dollars per hour
    state: "pending" //or "accepted" or "rejected"
    title: "job title"
    job: 10 //this is an ID and is primarily so you can put a link to job/${data.applications[index].job} to show job details from here (i'd leave target = "_blank" peersonally as well)
}
note that I'm not including everything in the JSON object, I'm leaving out some internal variables like ID's and such
*/