# WFP Candidate 8498373

Thank you for the opportunity to work on this project. I have enjoyed the challenge.

Regarding this repo, I would normally separate the backend and frontend into two different repos, but I have kept them together for simplicity.

PS: some instructions were not super clear, so I have made some assumptions.

## How to run

1. Clone the repo
2. There are two directories, one for `backend` and one for `frontend`.
3. First go to the `backend` directory and install the dependencies with `python3 -m pip install -r requirements.txt`
4. Run the backend application with `flask --app flasker run --port 5001`
5. You can test the endpoints with the following endpoints:
   - Metric A (GET): http://localhost:5001/api/country/{ISO3}/{date_start}/{date_end}/metricA
   - Metrid B (GET): http://localhost:5001/api/country/{ISO3}/{date_start}/{date_end}/metricB
   - Variance (GET): http://localhost:5001/api/country/{ISO3}/{date_start}/{date_end}/variance
6. You can also use the frontend to navigate through these endpoints.
7. In a different terminal, go to the `frontend` directory and install dependencies with `yarn install` or `npm install`.
8. Run the frontend application with `yarn dev` or `npm run dev`.
9.  You can find the application here: http://localhost:3000

## Notes

- For the backend I chose to use Flask, as it is a very simple framework to create a REST APIs.
- For the frontend I chose to use React, which is the library I am most familiar with.
- Please note that normally I would use a framework like NextJS for the frontend, to leverage the benefits of server-side rendering. However, due to simplicity of the project I chose to use plain React with Vite.
