'use strict';
const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const async = require('async');
const https = require('https');
const path = require("path");
const fs=require("fs");
const util = require('util');
const { json } = require("express");

const readFile=util.promisify(fs.readFile);


const key = 'a68c1120d1214de6910eb5220e9765ef';
const endpoint = 'https://craciun3.cognitiveservices.azure.com/';


const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

async function keyPhraseExtraction(client,result,keyPhrasesInput){

    // const keyPhrasesInput = [
    //     "My cat might need to see a veterinarian.",
    // ];
    const keyPhraseResult = await client.extractKeyPhrases(keyPhrasesInput);
    let result1;
    keyPhraseResult.forEach(document => {
        result1+=(`\tDocument Key Phrases: ${document.keyPhrases}`);
    });
    result.entity.push(result1);
}


async function linkedEntityRecognition(client,result,linkedEntityInput){

    // const linkedEntityInput = [
    //     "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect, while also being the largest individual shareholder until May 2014."
    // ];
    const entityResults = await client.recognizeLinkedEntities(linkedEntityInput);
    let result1="";
    entityResults.forEach(document => {
        document.entities.forEach(entity => {
            result1+=(`\tName: ${entity.name} \tID: ${entity.dataSourceEntityId} \tURL: ${entity.url} \tData Source: ${entity.dataSource}`);
            result1+=(`\tMatches:`)
            entity.matches.forEach(match => {
                result1+=(`\t\tText: ${match.text} \tScore: ${match.confidenceScore.toFixed(2)}`);
        })
        });
    });
    result.entity.push(result1);
}



async function piiRecognition(client,result,documents) {

    // const documents = [
    //     "The employee's phone number is (555) 555-5555."
    // ];
    let result1="";
    const results = await client.recognizePiiEntities(documents, "en");
    for (const result of results) {
        if (result.error === undefined) {
            result1+=("Redacted Text: ", result.redactedText);
            result1+=(" -- Recognized PII entities for input", result.id, "--");
            for (const entity of result.entities) {
                result1+=(entity.text, ":", entity.category, "(Score:", entity.confidenceScore, ")");
            }
        } else {
            result1+=("Encountered an error:", result.error);
        }
    }
    result.entity.push(result1);
}


async function entityRecognition(client,result,entityInputs){

    // const entityInputs = [
    //     "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800",
    //     "La sede principal de Microsoft se encuentra en la ciudad de Redmond, a 21 kilómetros de Seattle."
    // ];
    const entityResults = await client.recognizeEntities(entityInputs);
    let result1="";
    entityResults.forEach(document => {
        document.entities.forEach(entity => {
            result1+=(`\tName: ${entity.text} \tCategory: ${entity.category} \tSubcategory: ${entity.subCategory ? entity.subCategory : "N/A"}`);
            result1+=(`\tScore: ${entity.confidenceScore}`);
        });
    });
    result.entity.push(result1);
    
}



async function languageDetection(client,result,languageInputArray) {

    // const languageInputArray = [
    //     "Ce document est rédigé en Français."
    // ];
    const languageResult = await client.detectLanguage(languageInputArray);

    languageResult.forEach(document => {
        result.language+=(`\tPrimary Language ${document.primaryLanguage.name}`)
    });
}


async function sentimentAnalysisWithOpinionMining(client,result1,sentimentInput){

    // const sentimentInput = [
    //   {
    //     text: "The food and service were unacceptable, but the concierge were nice",
    //     id: "0",
    //     language: "en"
    //   }
    // ];
    const results = await client.analyzeSentiment(sentimentInput, { includeOpinionMining: true });
  
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (!result.error) {
        result1.opinion+=(`\tDocument text: ${sentimentInput[i].text}`);
        result1.opinion+=(`\tOverall Sentiment: ${result.sentiment}`);
        result1.opinion+=("\tSentiment confidence scores:", result.confidenceScores);
        result1.opinion+=("\tSentences");
        for (const { sentiment, confidenceScores, opinions } of result.sentences) {
          result1.opinion+=(`\t- Sentence sentiment: ${sentiment}`);
          result1.opinion+=("\t  Confidence scores:", confidenceScores);
          result1.opinion+=("\t  Mined opinions");
          for (const { target, assessments } of opinions) {
            result1.opinion+=(`\t\t- Target text: ${target.text}`);
            result1.opinion+=(`\t\t  Target sentiment: ${target.sentiment}`);
            result1.opinion+=("\t\t  Target confidence scores:", target.confidenceScores);
            result1.opinion+=("\t\t  Target assessments");
            for (const { text, sentiment } of assessments) {
                result1.opinion+=(`\t\t\t- Text: ${text}`);
                result1.opinion+=(`\t\t\t  Sentiment: ${sentiment}`);
            }
          }
        }
      } else {
        result1.opinion+=(`\tError: ${result.error}`);
      }
    }
}




async function sentimentAnalysis(client,result,sentimentInput){

    // const sentimentInput = [
    //     "I had the best day of my life. I wish you were there with me."
    // ];
    const sentimentResult = await client.analyzeSentiment(sentimentInput);

    sentimentResult.forEach(document => {
        result.sentiment+=(`\tDocument Sentiment: ${document.sentiment}! `);
        result.sentiment+=(`\tDocument Scores:`);
        result.sentiment+=(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)}, \tNegative: ${document.confidenceScores.negative.toFixed(2)}, \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
        result.sentiment+=(`. \tSentences Sentiment(${document.sentences.length}):`);
        document.sentences.forEach(sentence => {
            result.sentiment+=(`\t\tSentence sentiment: ${sentence.sentiment}`)
            result.sentiment+=(`\t\tSentences Scores:`);
            result.sentiment+=(`\t\tPositive: ${sentence.confidenceScores.positive.toFixed(2)} \tNegative: ${sentence.confidenceScores.negative.toFixed(2)} \tNeutral: ${sentence.confidenceScores.neutral.toFixed(2)}\n`);
        });
    });
}
async function determineLanguage(language,shortness)
{
    await readFile("languages.json").then((res)=>{
        let data=JSON.parse(res);
        data["data"].map((el)=>{
            if(el.language===language)
                shortness=el.short;
        })
    });
}
async function determineSentiment(text)
{
    let sentimentInput=[text];
    const sentimentResult = await textAnalyticsClient.analyzeSentiment(sentimentInput);
    let sentiment="";
    sentimentResult.forEach(document => {
        sentiment+=(`\tDocument Sentiment: ${document.sentiment}! `);
        sentiment+=(`\tDocument Scores:`);
        sentiment+=(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)}, \tNegative: ${document.confidenceScores.negative.toFixed(2)}, \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
        sentiment+=(`. \tSentences Sentiment(${document.sentences.length}):`);
        document.sentences.forEach(sentence => {
           sentiment+=(`\t\tSentence sentiment: ${sentence.sentiment}`)
            sentiment+=(`\t\tSentences Scores:`);
            sentiment+=(`\t\tPositive: ${sentence.confidenceScores.positive.toFixed(2)} \tNegative: ${sentence.confidenceScores.negative.toFixed(2)} \tNeutral: ${sentence.confidenceScores.neutral.toFixed(2)}\n`);
        });
    });
    return sentiment;
}
async function textAnalytics(response,text)
{
    let result={
        sentiment:"",
        opinion:"",
        language:"",
        languageShort:"en",
        entity:[],
    };
    console.log("Eroare1");
    try {
        let sentimentInput=[text];
        await sentimentAnalysis(textAnalyticsClient,result,sentimentInput);
        console.log("Eroare2");
        await languageDetection(textAnalyticsClient,result,sentimentInput);
        console.log("Eroare1");
        console.log(result);
        //await determineLanguage(result.language.split().pop(),response.languageShort);
        // console.log("Eroare1");
         await sentimentAnalysisWithOpinionMining(textAnalyticsClient,result,[{
            text:text,id:"0",language:result.languageShort
        }]);
        console.log("Eroare1");
        await entityRecognition(textAnalyticsClient,result,[text]);
        console.log("Eroare1");
        await linkedEntityRecognition(textAnalyticsClient,result,[text]);
        console.log("Eroare1");
        await piiRecognition(textAnalyticsClient,result,[text]);
        console.log("Eroare1");
        await keyPhraseExtraction(textAnalyticsClient,result,[text]);
        console.log("Eroare1");
        console.log(result);
        response.json(result);

    } catch (error) {
        response.send(error);
    }
}

module.exports={textAnalytics,determineSentiment}