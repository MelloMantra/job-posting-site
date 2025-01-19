//If you are getting errors for like the URL and stuff, make sure you're running using node src/index.js and are on localhost:300/allApps/:jobId (I usually use jobId 1)
document.addEventListener("DOMContentLoaded", async function () {
    var data;
  
    const jobId = window.location.pathname.split('/').pop();
    try {
      const response = await fetch(`../api/company/getApplications/${jobId}`, {
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
      console.error('Error querying database:', err);
    }
});
/*
The above code will fetch all applications to the job in this form:
applications: [
    {
      created_at: "yyyy-mm-ddThh:mm:ss", //note that T is the seperator between year/month/day and hour/minute/second, you might want to splice the string at T for display
      state: "pending" //or "accepted" or "rejected"
      educationLevel: "HS Diploma" //or "College Degree" or "Trade Certificate",
      email: "person@email.com",
      firstName: "John",
      lastName: "Doe",
      majorLevel: "Associates", //or "Bachelors" or "Masters" or "PhD"
      major: "COMPUTER SCIENCE", //note that for some reason the dataset is all caps, so you might want to capitalize this properly for display
      majorType: "Technical Studies", //basically just a category for the major, not really important to display but maybe idk
      pastExperienceCompany: "Google",
      pastExperienceTitle: "Software Engineer",
      university: "University of California, Berkeley",
      id: 1, //this is the id of the application, please use this as a parameter in the makeDecision function
    }
] 
note that not all fields are included here, only the ones you may need. I'm leaving out internal variables and stuff like that. also, applications will be sorted by date created
*/

/*As far as styling/design goes, here's a rough outline of what I'm thinking:
  I realize that for the most part the styling itself is done, but please add a subinterface which shows a person's name, major, university, past experience (just their most recent job),
  email, and educationlevel. The decision button is pretty simple, just a button, and have a button to download a resume (the code for which I will do once the page is done)

  If you genuinely don't have time for a subinterface to show all user data, just make sure you update the HTML with the data from the dataset and have stuff like name
  and a link to download their resume (which should hopefully have everything anyways)
*/

//please add these as event listeners to the HTML using the data.applications[index].id as the parameter for applicationId (explained above). This is NOT the index of the application in the data.applications list
//decision must always be "pending", "accepted", or "rejected" and this function should be called whenever the current decision is changed (perhaps with a button or dropdown menu)
//A call might look something like this: makeDescision(3, "accepted"); or makeDecision(4, "rejected");
async function makeDecision(applicationId, decision) {
  if (decision !== "accepted" && decision !== "rejected") { //I'm not going to add 'pending' even though it's technically valid, since that's the default and not a decision
    alert("Decision must be 'accepted' or 'rejected'.");
    return;
  }

  try {
    const response = await fetch(`../api/company/makeDecision/${applicationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ decision: decision })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      return
    } else {
      console.log(`Error: ${response.status} ${response.statusText}`);
      alert("Internal server error.");
    } 
    
  } catch (err) {
    console.error('Error querying database:', err);
  }
}
//I'd recommend adding frontend code that locks this once the decision is made (ie: disable the decision button), but that's up to you and not 100% necessary

async function closeJob(statusChange) {//status should be "closed" or "decided". Closed means no longer accepting applications, but not decided on who to hire, decided means someone is hired and no longer accepting applications
  const jobId = window.location.pathname.split('/').pop();
  if (statusChange !== "closed" && statusChange !== "decided") {
    alert("Status must be 'closed' or 'decided'.");
    return;
  }

  try {
    const response = await fetch(`../api/company/updateJobStatus/${jobId}`, { //note that if status is "decided", then all applications not already accepted will be rejected
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: statusChange })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
      return
    } else {
      console.log(`Error: ${response.status} ${response.statusText}`);
      alert("Internal server error.");
    }
    
  } catch (err) {
    console.error('Error querying database:', err);
  }
}
/*
I'd recommend adding frontend code that locks this and updates all non-accepted applications to rejected if the job is decided (this will be done on backend as well, but
frontend won't sync with that unless the page is reloaded (so you could also just reload the page)). Keep in mind any attempts to update applications after the job is 
decided will be rejected on the backend, so I'd also reflect that in the frontend (and perhaps include a "warning" message that the job will be locked if it's decided).
This also means that a company can't reopen or switch a job to closed once it's decided (though I may implement a reopen feature in the future).
*/