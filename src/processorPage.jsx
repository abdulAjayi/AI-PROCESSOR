import React, { useState } from "react";
const ProcessorPage = () => {
    const [inputText, setInputText] = useState("")
    const [outputText, setOutputText] = useState([])
    const [language, setLanguage] = useState("")
    const handleInputChange = (e) =>{
        setInputText(e.target.value)
        console.log(inputText);
    }
    

    const HandleSubmit = async(e) =>{
        e.preventDefault()
        if(inputText.trim() !== ""){
            setOutputText([...outputText, {text: inputText, language: "detecting...", summary: "", translated: "translating..."}])
        }
        setInputText("")
        // console.log(inputText.text.length);
        
        const detectL = await detectLanguage(inputText)
        try {
            setOutputText( (prev) => {
                return prev.map((msg, index) => (
                    index === prev.length - 1 ? {...msg, language:detectL} : msg
                ))
            })
        } catch (error) {
            console.error("language detection failed", error)
        }
    }
    const detectLanguage = async (text) =>{
        if("ai" in window && "languageDetector" in window.ai){
            try {
                const detectL = await window.ai.languageDetector.create()
                const result = await detectL.detect(text)
                if(text.length > 0 ) {
                    return result[0].detectedLanguage
                }
            } catch (error) {
                console.error("couldn't detect language", error)
            }
            
        }
        return "error"
    }

    const handleSummarizeFetch = async(text) => {
        // try {
        //     const summarizeApi = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
        //         method :"POST",
        //         headers:{
        //             "Content-Type": "application/json",
        //             Authorization: "Bearer YOUR_HUGGINGFACE_API_KEY",
        //         },
        //         body: JSON.stringify({text})

        //     });
        //     const data = await summarizeApi.json()
        //     return data.summary
        // } catch (error) {
        //     console.error("pls select the right choice", error)
        // }
        console.log("ai" in window, "summarizer" in window.ai);
        if ("ai" in window && "summarizer" in window.ai) {
            try {
              // Create an instance of the Summarizer API.
              const summarizer = await window.ai.summarizer.create();
              // Use the summarizer to summarize the provided text.
              const result = await summarizer.summarize(text);
              // Assume the API returns an object with a `summary` property.
              if (result && result.summary) {
                return result.summary;
              }
            } catch (error) {
              console.error("Summarizer API error:", error);
            }
          }
          return "Error summarizing text";
    }

    const handleSummarizeClick = async(index) =>{
        const message = outputText[index]
        console.log(index)
        console.log(outputText);
        
        
        try {
            const summary = await handleSummarizeFetch(message.text)
            setOutputText((prev) =>{
                return prev.map( (msg, idx) =>{
                    return idx === index ? {...msg, summary} : msg
                })
            })
        } catch (error) {
            console.error("pls do the write thins", error)
        }
    }

    const handleLanguageChange = (e) =>{
        setLanguage(e.target.value)
    }
    
    const getTranslatedText = async(message, target, sourceLanguage) =>{
        
        if(!sourceLanguage) {
            console.error("source language is not defined.")
            return "source language not defined"
        }

        if("ai" in window && "translator" in window.ai){
            const translatorCapabilities = await window.ai.translator.capabilities()
            // const you = translatorCapabilities.languagePairAvailable('es', 'fr');
            console.log(translatorCapabilities);
            
            
            
            // try {
            //     const translator = await window.ai.translator.create({
            //         sourceLanguage: sourceLanguage, 
            //         targetLanguage: target
            //     });
            //     const result = await translator.translate(message, target)
            //     if(result && result.translatedText){
            //         return result.translatedText
            //     }
            //     else{
            //         console.error("translation API response missing translatedText")
            //         return "Translation failed: Invalid API response"
            //     }
            // } catch (error) {
            //     console.error("couldn't translate", error)
            //     return `Translation failed: ${error.message}`
            // }
        }
    }
    const handleTranslateClick = async(index) =>{
        const message = outputText[index]
        try {
            const translatedtext = await getTranslatedText(message.text, language,message.language)

            setOutputText((prev) => {
                return prev.map((msg, idx) => {
                    return idx === index? {...msg, translated: translatedtext} : msg
                })
            })
        } catch (error) {
            console.error("Error translating text", error)
            setOutputText((prev) => {
                return prev.map((msg, idx) => {
                    return idx === index? {...msg, translated: "translation failed"} : msg
                })
            })
        }
        }
        
        
        return ( 
            <div>
                <div className="flex justify-center">
                <div className="flex justify-between mb-10 items-center w-[85vw]">
                    <p className="text-gray-300 text-2xl">AI TextProcessor</p>
                <select name="" id="" className="border border-gray-600  bg-light1 text-gray-300 text-lg rounded-2xl px-4 py-1 outline-none" onChange={handleLanguageChange} value={language}>
                <option value="">select language</option>
                <option value="pt">Portuguese(Pt)</option>
                <option value="en">English(En)</option>
                <option value="es">Spanish(Es)</option>
                <option value="ru">Russian(Ru)</option>
                <option value="tr">Turkish(Tr)</option>
                <option value="fr">French(Fr)</option>
            </select>
                </div>
                </div>
            <div className="w-[85vw] mx-auto p-4 space-y-16 mb-11 pb-40">
        {outputText.map((output, index) =>(
            <div className="relative" key={index} >
            <div className="flex justify-end ">
                <p className="border border-gray-600  bg-light1 text-gray-300 rounded-2xl px-4 py-1 max-w-md break-words">{output.text}</p>
                
            </div>
        <div className="flex gap-x-3 right-0 mt-1 absolute">
            {output.language === "en" && output.text.length > 15 && !output.summary &&(
                <button className="text-gray-300  px-3 py-1 bg-deep2  border border-lightText rounded-full" onClick={ () => handleSummarizeClick(index)}>summarize</button>
            )}
            <button className="text-gray-300  px-3 py-1 bg-deep2  border border-lightText rounded-full" onClick={ () => {handleTranslateClick(index)}}>Translate</button>
            <button className="text-gray-300  px-3 py-1 bg-deep2  border border-lightText rounded-full">detected: {output.language}</button>
        </div>
        
    {output.summary && (
        <div className="flex justify-start">
            <p className="gap-y-6 flex-col border border-gray-600  bg-light1 text-gray-300 rounded-2xl px-10 py-6 mt-16 ">{output.summary}</p>
    </div>
            )}

            {output.translated &&(
                <div className="flex justify-start">
                <p className="gap-y-6 flex-col border border-gray-600  bg-light1 text-gray-300 rounded-2xl px-10 py-6 mt-16 ">{output.translated}</p>
        </div>
            )}
    
        </div>
))}
{/* {currentSummary ? (
<div className="flex gap-y-6 flex-col border border-gray-600  bg-light1 text-gray-300 rounded-2xl p-6 justify-start">
    <p>{currentSummary}</p>
</div>
): ( <p>No summary available yet.</p>)
    } */}
    </div>
    <div className="left-1/2 transform -translate-x-1/2  fixed bottom-0 bg-light1 rounded-md px-1 pb-4 pt-1">
    <form action="" className="w-[85vw] bg-deep2 px-2 py-2 rounded-lg" onSubmit={HandleSubmit}>
        <div className="">
            <textarea onChange={handleInputChange} value={inputText} name="" id="" className="bg-transparent border-transparent resize-none w-full outline-none border-b-light1 border scrollbar-hide text-gray-300 " placeholder="what's on your mind 😃? "></textarea>
            <div className="flex justify-between mb-2">

                <button className="rounded-full p-1 w-8  border-lightText border text-white"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
    <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
</svg>
</button>
                <button type='submit' className="border border-lightText w-8 flex justify-center rounded-full p-1 text-white"><svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
</svg>
</button>
            </div>
            <div className="flex justify-between">
                <span className="text-sm text-lightText">
                    Verified User
                </span>
                <div className="flex items-center gap-x-1 ">
                    <div className="rounded-full w-1 h-1 bg-lightText"></div>
                    <span className="text-sm text-lightText ">Send</span>
                </div>
            </div>
        </div>
    </form>
    </div>
        </div>
    );
}
export default ProcessorPage;


