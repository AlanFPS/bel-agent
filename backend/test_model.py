from ctransformers import AutoModelForCausalLM

model_path = "models/orca-mini-3b-gguf2-q4_0.gguf"

model = AutoModelForCausalLM.from_pretrained(
    model_path,
    model_type="llama"
)

prompt = "Hello, how are you?"
output = model(prompt, max_new_tokens=64)
print("Model output:", output)