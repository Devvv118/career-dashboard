// Snapshot taken on 21 October 2026. The live deployment ships with this data only, so no real
// inbox or visitor data is exposed. Set VITE_API_URL / VITE_PORTFOLIO_API_URL to switch to live data.
export const SAMPLE_DATE = "21 October 2026";

export const sampleReport = {
  "success": true,
  "generated_at": "2026-10-21T04:10:51.714Z",
  "window_hours": 24,
  "emails_analyzed": 17,
  "counts": {
    "emails": 17,
    "job_openings": 5,
    "reported_errors": 0
  },
  "summary": "Received several placement drive invitations from VIT, alongside job recommendations for AI Developer and Software Engineer Intern roles from Indeed and LinkedIn.",
  "job_openings": [
    {
      "company": "CFOLogic pvt Ltd",
      "role": "AI Developer",
      "experience": "Unknown",
      "source_email": "AI Developer @ CFOLogic pvt Ltd",
      "sender": "Indeed <donotreply@match.indeed.com>",
      "received_at": "2026-10-20T00:49:43.000Z",
      "evidence": "AI Developer, CFOLogic pvt Ltd"
    },
    {
      "company": "Stripe",
      "role": "Software Engineer, Intern",
      "experience": "Unknown",
      "source_email": "View Stripe jobs and your next steps",
      "sender": "LinkedIn <messages-noreply@linkedin.com>",
      "received_at": "2026-10-20T10:03:39.000Z",
      "evidence": "Software Engineer, Intern, Stripe"
    },
    {
      "company": "Weekday (YC W21)",
      "role": "Software Engineer Intern",
      "experience": "Unknown",
      "source_email": "View Stripe jobs and your next steps",
      "sender": "LinkedIn <messages-noreply@linkedin.com>",
      "received_at": "2026-10-20T10:03:39.000Z",
      "evidence": "Software Engineer Intern, Weekday (YC W21)"
    },
    {
      "company": "Thermofishersci",
      "role": "Placement Drive",
      "experience": "Unknown",
      "source_email": "Congratulations! You're Eligible for Thermofishersci Placement Drive",
      "sender": "VIT - Soft Skill Assessments <noreply.cdcinfo@vitstudent.ac.in>",
      "received_at": "2026-10-20T12:32:58.000Z",
      "evidence": "you are eligible to participate in the upcoming placement drive with Thermofishersci"
    },
    {
      "company": "Nvidia",
      "role": "Placement Drive",
      "experience": "Unknown",
      "source_email": "Congratulations! You're Eligible for Nvidia Placement Drive",
      "sender": "VIT - Soft Skill Assessments <noreply.cdcinfo@vitstudent.ac.in>",
      "received_at": "2026-10-20T12:18:40.000Z",
      "evidence": "you are eligible to participate in the upcoming placement drive with Nvidia"
    }
  ],
  "reported_errors": [],
  "model_used": "gemini-3.1-flash-lite"
};

export const samplePortfolio = {
  "theme": {
    "toDark": {
      "count": 2,
      "lastAt": "2026-10-21T04:26:03.561Z"
    },
    "toLight": {
      "count": 2,
      "lastAt": "2026-10-21T04:26:03.511Z"
    }
  },
  "projects": {
    "io-workload-classifier": {
      "open": {
        "count": 1,
        "lastAt": "2026-10-21T04:25:32.882Z"
      },
      "github": {
        "count": 0,
        "lastAt": null
      },
      "live": {
        "count": 0,
        "lastAt": null
      },
      "total": 1
    },
    "data-analyst-agent": {
      "open": {
        "count": 1,
        "lastAt": "2026-10-21T04:40:44.514Z"
      },
      "github": {
        "count": 0,
        "lastAt": null
      },
      "live": {
        "count": 1,
        "lastAt": "2026-10-21T04:40:45.523Z"
      },
      "total": 2
    },
    "vehicle-rental-system": {
      "open": {
        "count": 1,
        "lastAt": "2026-10-21T04:40:52.785Z"
      },
      "github": {
        "count": 1,
        "lastAt": "2026-10-21T04:40:53.249Z"
      },
      "live": {
        "count": 0,
        "lastAt": null
      },
      "total": 2
    },
    "virtual-teaching-assistant": {
      "open": {
        "count": 1,
        "lastAt": "2026-10-21T04:41:01.185Z"
      },
      "github": {
        "count": 0,
        "lastAt": null
      },
      "live": {
        "count": 1,
        "lastAt": "2026-10-21T04:41:02.230Z"
      },
      "total": 2
    }
  },
  "totals": {
    "themeSwitches": 4,
    "projectOpens": 4,
    "githubClicks": 1,
    "liveClicks": 2
  },
  "generatedAt": "2026-10-21T04:41:15.168Z"
};
