import React, { useState } from "react";
const ProcessorPage = () => {
    const [inputText, setInputText] = useState("")
    const [outputText, setOutputText] = useState([])
    const [language, setLanguage] = useState("")
    const [showIntro, setShowIntro] = useState(true);
    const handleInputChange = (e) =>{
        setInputText(e.target.value)
        console.log(inputText);
    }
    

    const HandleSubmit = async(e) =>{
        e.preventDefault()
        if(inputText.trim() !== ""){
            setOutputText([...outputText, {text: inputText, language: "detecting...", summary: "", translated: ""}])
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
            setShowIntro(false)
        } catch (error) {
            console.error("language detection failed", error)
        }
    }
    const detectLanguage = async (text) =>{
        if("ai" in window && "languageDetector" in window.ai){
            console.log("ai" in window && "languageDetector" in window.ai);
            
            try {
                const detectL = await window.ai.languageDetector.create()
                const result = await detectL.detect(text)
                
                if(text.length > 0 ) {
                    return result[0].detectedLanguage
                }
                console.log(result);
            } catch (error) {
                console.error("couldn't detect language", error)
            }
            
        }
        return "error"
    }

    const handleSummarizeFetch = async(text) => {
        console.log("ai" in window, "summarizer" in window.ai);
        if ("ai" in window && "summarizer" in window.ai) {
            try {
              // Create an instance of the Summarizer API.
              const summarizer = await window.ai.summarizer.create();
              // Use the summarizer to summarize the provided text.
              const result = await summarizer.summarize(text);
              // Assume the API returns an object with a `summary` property.
              if (result) {
                return result
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
            console.log(summary);
            
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
    
    const getTranslatedText = async(text, targetLanguage, sourceLanguage) =>{
        if("ai" in window && "translator" in window.ai){
            const translatorCapabilities = await window.ai.translator.capabilities();
	if (sourceLanguage === targetLanguage) {
		return text;
	}
	const canDetect = translatorCapabilities.languagePairAvailable(sourceLanguage, targetLanguage);
	console.log("Can detect:", canDetect);
	let translator;
	if (canDetect === "no") {
		// The language detector isn't usable.
		return;
	}
	if (canDetect === "readily") {
		// The language detector can immediately be used.
		translator = await window.ai.translator.create({
			sourceLanguage,
			targetLanguage,
		});
		console.log({
			sourceLanguage,
			targetLanguage,
		});
	} else {
		// The language detector can be used after model download.
		translator = await window.ai.translator.create({
			sourceLanguage,
			targetLanguage,
			monitor(m) {
				m.addEventListener("downloadprogress", (e) => {
					console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
				});
			},		});
		await translator.ready;
	}
	
	try {
		const response = await translator.translate(text);
		return response;
	} catch (error) {
		console.error("Error translating text:", error);
		throw error;
	}


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
                {showIntro && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl text-gray-300 w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[60vw] m-auto">Words have power. What will yours say?</h1>
        </div>
      )}
                <div className="mx-auto w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[60vw]">
                <div className="flex justify-between mb-10 items-center fixed top-0 mx-auto w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[60vw] z-10 bg-deep1 border-b border-b-detectionText p-4">
                    <p className="text-gray-300 text-2xl">TextAI</p>
                <select name="" id="" className="border border-gray-600  bg-light1 text-gray-300 text-lg rounded-2xl px-4 py-1 outline-none cursor-pointer" onChange={handleLanguageChange} >

                <option value="">select languages</option>
                <option value="pt">Portuguese(Pt)</option>
                <option value="en">English(En)</option>
                <option value="es">Spanish(Es)</option>
                <option value="ru">Russian(Ru)</option>
                <option value="tr">Turkish(Tr)</option>
                <option value="fr">French(Fr)</option>
            </select>
                </div>
                </div>
            <div className="w-[80vw] mx-auto space-y-16 mb-11 pb-40 md:w-[75vw] lg:w-[65vw] xl:w-[60vw] mt-14">
        {outputText.map((output, index) =>(
            <div className="relative" key={index} >
            <div className="flex justify-end ">
                <p className="border border-gray-600  bg-light1 text-gray-300 rounded-2xl px-4 py-1 max-w-md break-words">{output.text}</p>
                
            </div>
        <div className="flex gap-x-3 right-0 mt-1 absolute">
            {output.language === "en" && output.text.length > 150 && !output.summary &&(
                <button className="text-gray-300  px-3 py-1 bg-deep2  border border-lightText rounded-full" onClick={ () => handleSummarizeClick(index)}>summarize</button>
            )}
            <button className="text-gray-300  px-3 py-1 bg-deep2  border border-lightText rounded-full" onClick={ () => {handleTranslateClick(index)}}>Translate</button>
            <button className="text-gray-300  px-3 py-1 bg-deep2  border border-lightText rounded-full">{output.language}</button>
        </div>
        
    {output.summary && (
        <div className="flex justify-start">
            <p className="gap-y-6 flex-col border border-gray-600  bg-light1 text-gray-300 rounded-2xl  px-4 py-3 mt-16 ">{output.summary}</p>
    </div>
            )}

            {output.translated &&(
                <div className="flex justify-start">
                <p className="gap-y-6 border border-gray-600  bg-light1 text-gray-300 rounded-2xl px-4 py-3 mt-16">{output.translated}</p>
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
    <form action="" className="w-[80vw] md:w-[75vw] lg:w-[65vw] xl:w-[60vw] bg-deep2 px-2 py-2 rounded-lg" onSubmit={HandleSubmit}>
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


