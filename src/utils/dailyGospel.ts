import type { DailyGospelScheme, QuoteScheme } from "@/interfaces/dailyGospelInterface";


export async function fetchDailyGospel(date: Date): Promise<DailyGospelScheme> {
    try {
      console.log(date.getMonth())
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const response = await fetch(`http://localhost:3000/fetch-webpage/${date.getFullYear()}/${month}/${day}`);
        
        if (!response.ok) {
          console.log("ERROR")
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export function parseCitation(citation: string) : QuoteScheme {
  const regex = /^([A-Za-z]{2})\s(\d+),(\d+)(?:-(\d+)(?:,(\d+))?)?/;
  const match = citation.match(regex);

  if (match) {
    return {
      evangelist: match[1].toLowerCase(),
      start: {
        chapter: match[2],
        verse: match[3],
      },
      end: {
        chapter: match[5] ? match[4] : match[2],
        verse: match[5] || (match[4] || match[3]),
      }
    };
  } else {
    throw new Error('Invalid reference format');
  }
}

function isValidDate(value : Date) {
  const date = new Date(value);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
      return false;
  }

  // Extract components and validate
  const year = date.getFullYear();
  const month = date.getMonth(); // Note: 0-based, Jan = 0
  const day = date.getDate();

  return year > 0 && month >= 0 && month <= 11 && day > 0 && day <= 31;
}