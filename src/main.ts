import express from "npm:express@4.18.2";
//import { oakCors } from "https://deno.land/x/cors/mod.ts";
import cors from "npm:cors";
import { readFileSync } from 'node:fs';
import https from "node:https";

const resume = readFileSync('dicarro_resume_0623.txt', 'utf-8');

const app: express.Applicattion = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/',(req,res) => {
    res.send("HELLO");
})

app.post("/gpt", (req, res) => {

    const { company, position, jobDescription } = req.body;

    const resumeOutput = `
    Rewrite and optimize my resume for this ${position} job description. Include keywords and skills from the job description.

    Here is the job description:
    ${jobDescription}

    Here is my resume:
    ${resume}`;

    const coverLetter = `
    Write a personalized cover letter for a ${position} role at ${company}. Make it three paragraphs long. Use language from the job description and include measurable metrics from my resume.

    Here is the job description:
    ${jobDescription}

    Here is my resume:
    ${resume}`;


    const companyInterest = `
    Uniquely answer the question "What interests you about our company?" using the following information and use less than 2000 characters.

    Company: ${company}
    
    Here is the job description:
    ${jobDescription}

    Here is my resume:
    ${resume}`;

    const returnJson = {
        resume: resumeOutput,
        coverletter: coverLetter,
        companyinterest: companyInterest,
        jobDescription: jobDescription,
    }

    res.json(returnJson);
});

https
.createServer(
    {
        key: readFileSync('key.pem', 'utf-8'),
        cert: readFileSync('cert.pem', 'utf-8'),
    },
    app)
.listen(1993, () => {
    console.log('Listening on port 1993');
});