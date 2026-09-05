from pathlib import Path
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader

docs = SimpleDirectoryReader(str(Path(__file__).resolve().parent / "docs_demo")).load_data()
index = VectorStoreIndex.from_documents(docs)
query_engine = index.as_query_engine()
print(query_engine.query("Que problema resuelve este documento?"))
