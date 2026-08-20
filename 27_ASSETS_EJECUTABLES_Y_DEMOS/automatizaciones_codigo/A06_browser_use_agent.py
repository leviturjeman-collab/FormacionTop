from browser_use import Agent
from langchain_openai import ChatOpenAI
import asyncio

async def main():
    agent = Agent(task="Abrir una web publica y extraer titulo, precio y enlace sin iniciar sesion", llm=ChatOpenAI(model="gpt-4.1-mini"))
    result = await agent.run()
    print(result)
asyncio.run(main())
