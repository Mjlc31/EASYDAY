
import { GoogleGenAI } from "@google/genai";
import { Task, QuadrantType, HistoryEntry } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getProductivityRoast = async (tasks: Task[], userStats: any) => {
  const completedToday = tasks.filter(t => t.completed && new Date(t.completedAt!).toDateString() === new Date().toDateString()).length;
  const pending = tasks.filter(t => !t.completed).length;
  const q1Pending = tasks.filter(t => !t.completed && t.quadrant === QuadrantType.Q1).length;
  
  const prompt = `
    Aja como Ícaro de Carvalho. Analise a "produtividade" desse usuário e dê um feedback BRUTAL, curto (max 20 palavras).
    Não use palavras fofas. Não dê parabéns medíocres. Se o usuário estiver mal, destrua as desculpas dele. Se estiver bem, diga que é o mínimo.
    
    Dados:
    - Pendências: ${pending}
    - Urgências acumuladas (Q1): ${q1Pending}
    - Fez hoje: ${completedToday}
    - Streak: ${userStats.streak}
    
    Exemplos de tom:
    "Você não está cansado, está entediado do seu próprio fracasso."
    "Parabéns por fazer o básico. Quer um biscoito?"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 1.0, 
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "A IA se recusa a analisar tamanha mediocridade.";
  }
};

export const generateWeeklyReport = async (history: HistoryEntry[]) => {
  const historyText = history.slice(0, 7).map(h => 
    `${h.date}: ${h.completedCount}/${h.totalTasks} concluídas.`
  ).join('\n');

  const prompt = `
    Aja como um mentor implacável estilo Ícaro de Carvalho.
    Analise a semana do usuário.
    
    Histórico dos últimos dias:
    ${historyText}

    Gere um relatório curto, direto e doloroso.
    Comece com uma frase de impacto sobre a performance geral.
    Depois, cite dias específicos se forem ruins.
    
    Exemplo:
    "Segunda você venceu. Terça você sobreviveu. Quarta você foi covarde e fugiu das suas obrigações.
    Quer tentar de novo ou vai continuar fingindo que trabalha?"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 150,
        temperature: 0.8,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Não consegui gerar seu relatório. Talvez sua semana tenha sido tão irrelevante que nem os dados carregaram.";
  }
};

export const getHeatmapInsights = async (tasks: Task[]) => {
  const completed = tasks.filter(t => t.completed && t.completedAt);
  const morning = completed.filter(t => { const h = new Date(t.completedAt!).getHours(); return h >= 5 && h < 12 }).length;
  const afternoon = completed.filter(t => { const h = new Date(t.completedAt!).getHours(); return h >= 12 && h < 18 }).length;
  const night = completed.filter(t => { const h = new Date(t.completedAt!).getHours(); return h >= 18 || h < 5 }).length;
  
  const total = morning + afternoon + night;
  
  // Robustness check for empty data
  if (total < 1) return "Sem dados suficientes para julgar sua rotina. Comece a trabalhar.";

  const prompt = `
    Aja como Ícaro de Carvalho. O usuário pediu uma análise dos horários de produtividade dele.
    
    Dados:
    - Manhã (05h-12h): ${morning} tarefas
    - Tarde (12h-18h): ${afternoon} tarefas
    - Noite (18h-05h): ${night} tarefas
    
    Identifique o padrão e julgue agressivamente.
    Se for noturno: "Você acha que é Batman ou só procrastinou o dia todo?"
    Se for tarde: "O famoso horário de quem acorda tarde e finge que produz."
    Se for manhã: "Começou bem, mas manteve? Duvido."
    
    Resposta CURTA (max 20 palavras). BRUTAL.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 1.0,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sua rotina é tão bagunçada que travou minha análise.";
  }
};
