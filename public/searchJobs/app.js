/*Implementation code:
this can be put in another file if needed
*/

/*
searchJobs expects a query and a filterOptions object, filteroptions must be in this format:
filterOptions = {
    industry: '',
    occupation: '',
    isRemote: '',
    minPay: '',
    jobType: '',
    sort: ''
}

Valid values for filterOptions are:
industry: any integer 1-20 (this is the ID of the industry, look at createJob/createJob.html and the industry dropdown for the ID's of each industry (there are 20, and the value of each dropdown item is the ID of the industry))
occupation: any integer (1- about 1000, the ID of the occupation, this will be part of the JSON object returned from the autocomplete search box in createJob/createJob.html and createJob/app.js)
isRemote: true or false
minPay: any float
jobType: "Internship", "Full Time", "Part Time", "Seasonal"
sort: "date_created", "estimatedPay"

please keep jobType and sort in these exact casings and wordings or else the function will interpret them as invalid, the names are the same as the columns of the database
you can have any of them empty (NULL, not empty string) as well, that will just assume that there is no filter/sorting

also, this is VERY important:
for occupation and industry, in createJob/ there is an existing dropdown and autocomplete search box which I'd recommend you use in the UI, I will leave comments in
the javascript file to explain how it works/what to copy. Obviously change the styling, but the functionality should be the same.
*/

//null values are fine for any options, this just means the user hasn't input anything. Please allow for the user to re-select null later (ie: if they, for example, selected an option in a dropdown and then wanted to not have anything selected, there should be an actual option for "none" or "all" because if you just have a variable which is default to null then set it, that won't really work)
const testFilterOptions = {
    industry: 5, //Construction, this is just what I set most of the test jobs to
    occupation: null,
    isRemote: false, //pretty much none of the test ones are true so you might not get any results if you query for true right now, but it should work
    minPay: 10, //this is in dollars
    jobType: null,
    sort: 'estimatedPay'
}

/*SearchJobs will return a JSON object in this format:
//note that I am purposefully leaving out internal variables and unimportant fields as not to confuse anybody. For example the "company" field has the id for the company that made the job, but I am not including it below because it's irrelevant
result: [
    {
        address: "Job Address",
        companyName: "Company Name",
        date_created: "yyyy-mm-ddThh:mm:ss", //note that T is the seperator between year/month/day and hour/minute/second, you might want to splice the string at T for display
        description: "Job Description", //this is a long text field, do not display this
        estimatedPay: 10, //in dollars
        industryName: "Job Industry",
        isRemote: True, //for UI I would personally just mark any remote jobs with "remote job" or something like that, but leave non-remote jobs blank
        preferredExperience: "Job Required Experience", //this is a long text field, do not display this
        title: "Job Title", //this is the title of the job so like "Software Developer"
        ScheduleType: "Full Time", //or "Part Time" or "Seasonal" or "Internship"
        id: 1, //this is the id of the job, please use this to link to the job details page (/JobDetails/{id})
        company: 1, //this is the id of the company that made the job, please use this to link to the company profile page (/companyProfile/{companyName}) (note that this page isn't yet implemented so this will link to nothing)
    }
]
*/

async function searchJobs(query, filterOptions) {
    if (!query) {
        return [];
    }

    try {
        var URL = `../api/all/searchJobs?query=${query}`;

        if (filterOptions?.industry) {
            URL += `&industry=${filterOptions.industry}`;
        }

        if (filterOptions?.occupation) {
            URL += `&occupation=${filterOptions.occupation}`;
        }

        if (filterOptions?.isRemote !== undefined) { //isRemote is a boolean
            URL += `&isRemote=${filterOptions.isRemote}`;
        }

        if (filterOptions?.minPay) {
            URL += `&minPay=${filterOptions.minPay}`;
        }

        if (filterOptions?.jobType) {
            URL += `&jobType=${filterOptions.jobType}`;
        }

        if (filterOptions?.sort) {
            URL += `&sort=${filterOptions.sort}`;
        }


        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            console.log(`Error: ${response.status} ${response.statusText}`);
            alert("Internal server error.");
            return [];
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error('Error querying database:', err);
        return [];
    }
}
//note that since there is no UI right now, to test this you will have to input into the inspect element console:
//searchJobs("t", testFilterOptions);
// or searchJobs("job", null);

/*Here's a vague outline of what I want for the actual page's HTML:
- Allow the user to search for jobs using a search bar and upon entering a query, display a list of jobs that match the query (and pressing enter or clicking the search 
button)

- have some way for a user to access options that let them change the filter/sort options, ie: industry, occupation, remote, pay, job type, etc. please read my above comments 
on that topic if you haven't already. I'd recommend making a button open a submenu above the original page which could hold these options, alternatively you could make a
sort of collapsible menu below the search bar which I've seen before, that has all the options. I'd also include an option to filter/sort overall so we can quickly toggle
that feature. Please just do not do anything like a dropdown menu on the right (sort of like what amazon does for filtering searches) because we already have a navbar
there

- every single job item should have a link to the job details page, ie: /jobDetails/{jobId}

- every single job item should have a button that allows the user to apply to the job, which will open a subpage or something that lets them upload their resume
I will handle the logic for that later

- there should also be a link to a company profile page, ie: /companyProfile/{companyName} (not sure if we'll get around to implementing this and it's low priority but at least
make it an empty href)

Styling & inclusion:
I am not the HTML/CSS police, so these are just recommendations and just an idea of what my vision of the page is, but please include whatever you think is necessary

The jobs should be in a bunch of rows, each row consisting of a job title, company name (link to company profile), location, pay, industry, and occupation
each job should be clickable, and should take you to the job details page, except for the company name which should take you to the company profile page, and the apply
button, which should open a subpage or something that lets the user upload their resume
*/
