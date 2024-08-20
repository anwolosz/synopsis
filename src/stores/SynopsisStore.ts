import { defineStore } from 'pinia'
import synopsis_szit from '@/assets/synopsis_szit.json'
import synopsis_esv from '@/assets/synopsis_esv.json'
import translation_en from '@/assets/translation/en.json'
import translation_hu from '@/assets/translation/hu.json'
import type { SynopsisScheme } from '@/interfaces/synopsisInterface'
const synopsis: SynopsisScheme = synopsis_szit
const synopsisEsv: SynopsisScheme = synopsis_esv
//TODO: proper typing
const translationEn: any = translation_en
const translationHu: any = translation_hu

export const useSynopsisStore = defineStore('synopsis', {
    state: () => {
        return {
            translation: translationHu,
            language: "hu",
            synopsis: synopsis,
        }
    },
    actions: {
        changeLanguage() {
            if (this.language === "hu")
            {
                this.translation = translationEn
                this.synopsis = synopsisEsv
                this.language = "en"
                localStorage.setItem("lang", "en");
            }
            else {
                this.translation = translationHu
                this.synopsis = synopsis
                this.language = "hu"
                localStorage.setItem("lang", "hu");
            }
        },
        //TODO: proper typing
        get(location: any) {

            let result:any = this.synopsis.chapters[location.chapterIndex]
            if (location.sectionIndex !== null)
            {
                result = result.sections[location.sectionIndex]
                if (location.subsectionIndex !== null)
                {
                    result = result.subsections[location.subsectionIndex]
                }
            }
            return result
        },
        setupLanguage(language: any)
        {
            if (language !== "en")
            {
                this.translation = translationHu,
                this.language = "hu",
                this.synopsis = synopsis
            }
            else {
                this.translation = translationEn,
                this.language = "en",
                this.synopsis = synopsisEsv
            }
        }
    }
})