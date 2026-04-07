# git-api-energyner-vercel



Energyner API Gateway is a comprehensive serverless services solution for Energy Efficiency, Carbon Footprint, Health \& Wellness and thermodynamic calculations. Developed in Node.js, it offers a modular architecture that connects high-precision backend processes with a PWA interface optimized for scalable cloud deployments.

===STRUCTURE===

•	git-api-energyner-vercel/

•	api/ <-- Vercel looks for the functions here.

&#x09;	o	energyServ.mjs (Your entry point)

&#x09;	o	\_calculations/ <-- The underscore \_ indicates to Vercel that it is NOT a public endpoint..

&#x09;				calories-burned.mjs

&#x09;				energy-consumption.mjs

&#x09;				...others

•	public/ <-- Vercel serves this statically automatically..

&#x09;	o	index.html

&#x09;	o      manifest.json

&#x09;	o	sw.js

&#x09;	o	assets/

•	.gitignore

•	package.json

•	README.md

•	vercel.json (Optional, to configure routes)



Author: @RRD

4/2026

