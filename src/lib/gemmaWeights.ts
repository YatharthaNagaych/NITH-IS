export type Gemma4ModelType = 'gemma-4' | 'gemma-4-code' | 'gemma-4-vision' | 'gemma-4-guard';
export type GemmaProvider = 'builtin' | 'huggingface' | 'ollama' | 'kaggle' | 'lmstudio' | 'docker';

export interface ModelWeightInfo {
  name: string;
  modelTag: string;
  parameters: string;
  architecture: string;
  quantization: string;
  contextWindow: string;
  primaryUse: string;
  huggingFace: {
    repoId: string;
    url: string;
    format: string;
  };
  ollama: {
    tag: string;
    runCommand: string;
    modelfileSnippet: string;
  };
  kaggle: {
    handle: string;
    url: string;
    frameworks: string;
  };
  lmStudio: {
    modelSearch: string;
    endpoint: string;
    quantRecommendation: string;
  };
  docker: {
    image: string;
    dockerRun: string;
    port: number;
  };
}

export const GEMMA_4_WEIGHTS_REGISTRY: Record<string, ModelWeightInfo> = {
  "gemma-4": {
    name: "Google Gemma 4 (Flagship Academic Reasoner)",
    modelTag: "Gemma 4",
    parameters: "9.4 Billion Parameters (Instruction-Tuned)",
    architecture: "Gemma 4 Decoder-only Transformer • Sliding Window & Global Attention • Soft-Capped Logits",
    quantization: "FP16 SafeTensors / Q4_K_M GGUF / INT4 AWQ",
    contextWindow: "16,384 Tokens",
    primaryUse: "NITH Academic Ordinance 7.2 Analysis, 75% Attendance Attendance Optimizer & Timetable Advisor",
    huggingFace: {
      repoId: "google/gemma-4-it",
      url: "https://huggingface.co/google/gemma-4-it",
      format: "SafeTensors (.safetensors) + GGUF Quantized",
    },
    ollama: {
      tag: "gemma4:latest",
      runCommand: "ollama run gemma4:latest",
      modelfileSnippet: "FROM gemma4:latest\nPARAMETER temperature 0.3\nPARAMETER num_ctx 16384\nSYSTEM \"You are the official NIT Hamirpur Gemma 4 Academic Copilot.\"",
    },
    kaggle: {
      handle: "google/gemma-4/transformers/gemma-4-it",
      url: "https://www.kaggle.com/models/google/gemma-4",
      frameworks: "PyTorch, JAX, Keras 3, TensorFlow Checkpoints",
    },
    lmStudio: {
      modelSearch: "google/gemma-4-it-GGUF",
      endpoint: "http://localhost:1234/v1/chat/completions",
      quantRecommendation: "Q4_K_M (Fastest on Apple Silicon / RTX)",
    },
    docker: {
      image: "vllm/vllm-openai:latest",
      dockerRun: "docker run -d --gpus all -p 8000:8000 --ipc=host vllm/vllm-openai:latest --model google/gemma-4-it --port 8000",
      port: 8000,
    },
  },
  "gemma-4-code": {
    name: "Google Gemma 4 Code (CodeGemma 4 Lab Engine)",
    modelTag: "CodeGemma 4",
    parameters: "7.2 Billion Parameters (Code Specialized)",
    architecture: "Gemma 4 Code Transformer trained on 650B+ tokens of code, C++20 STL, Python & algorithms",
    quantization: "FP16 SafeTensors / Q5_K_M GGUF",
    contextWindow: "16,384 Tokens",
    primaryUse: "CS-304 DAA, CS-302 OS Labs, C++, Python, Verilog HDL synthesis, Dijkstra & Algorithm Debugger",
    huggingFace: {
      repoId: "google/codegemma-4-it",
      url: "https://huggingface.co/google/codegemma-4-it",
      format: "SafeTensors + GGUF (Fill-in-the-Middle FIM support)",
    },
    ollama: {
      tag: "codegemma4:latest",
      runCommand: "ollama run codegemma4:latest",
      modelfileSnippet: "FROM codegemma4:latest\nPARAMETER temperature 0.1\nPARAMETER num_ctx 16384\nSYSTEM \"You are CodeGemma 4, engineering code debugger for NIT Hamirpur.\"",
    },
    kaggle: {
      handle: "google/codegemma-4/transformers/codegemma-4-it",
      url: "https://www.kaggle.com/models/google/codegemma-4",
      frameworks: "PyTorch & JAX Code Checkpoints",
    },
    lmStudio: {
      modelSearch: "google/codegemma-4-it-GGUF",
      endpoint: "http://localhost:1234/v1/chat/completions",
      quantRecommendation: "Q5_K_M (High code precision)",
    },
    docker: {
      image: "vllm/vllm-openai:latest",
      dockerRun: "docker run -d --gpus all -p 8000:8000 --ipc=host vllm/vllm-openai:latest --model google/codegemma-4-it --port 8000",
      port: 8000,
    },
  },
  "gemma-4-vision": {
    name: "Google Gemma 4 Vision (PaliGemma 4 Multimodal)",
    modelTag: "PaliGemma 4",
    parameters: "3.2 Billion Parameters (SigLIP-2 Vision Encoder + Gemma 4 Decoder)",
    architecture: "Multimodal Vision-Language Model with 448x448 Patch Resolution & Contrastive Pre-training",
    quantization: "FP16 SafeTensors / INT8 GGUF",
    contextWindow: "8,192 Tokens + 512 Vision Tokens",
    primaryUse: "Student ID Card Authentication, Medical Leave Certificate OCR, Grade Card Verification",
    huggingFace: {
      repoId: "google/paligemma-4-pt-448",
      url: "https://huggingface.co/google/paligemma-4-pt-448",
      format: "SafeTensors (Vision + Language weights combined)",
    },
    ollama: {
      tag: "paligemma4:latest",
      runCommand: "ollama run paligemma4:latest",
      modelfileSnippet: "FROM paligemma4:latest\nPARAMETER temperature 0.2\nSYSTEM \"PaliGemma 4 Multimodal Academic Document & Student ID Verifier for NITH.\"",
    },
    kaggle: {
      handle: "google/paligemma-4/transformers/paligemma-4-pt-448",
      url: "https://www.kaggle.com/models/google/paligemma-4",
      frameworks: "JAX & PyTorch Vision Checkpoints",
    },
    lmStudio: {
      modelSearch: "google/paligemma-4-pt-448-GGUF",
      endpoint: "http://localhost:1234/v1/chat/completions",
      quantRecommendation: "FP16 Vision Projections",
    },
    docker: {
      image: "ghcr.io/huggingface/text-generation-inference:latest",
      dockerRun: "docker run -d --gpus all -p 8000:80 --ipc=host ghcr.io/huggingface/text-generation-inference:latest --model-id google/paligemma-4-pt-448",
      port: 8000,
    },
  },
  "gemma-4-guard": {
    name: "Google Gemma 4 Guard (ShieldGemma 4 Safety)",
    modelTag: "ShieldGemma 4",
    parameters: "2.8 Billion Parameters (Institutional Policy Classifier)",
    architecture: "Safety-tuned Gemma 4 backbone for zero-tolerance policy filtering and grievance escalation",
    quantization: "INT4 AWQ / FP16 SafeTensors",
    contextWindow: "16,384 Tokens",
    primaryUse: "Supreme Court & UGC Anti-Ragging Compliance, Hostel Safety Escalation, Ordinance 7.2 Guard",
    huggingFace: {
      repoId: "google/shieldgemma-4-2b",
      url: "https://huggingface.co/google/shieldgemma-4-2b",
      format: "SafeTensors Classifier",
    },
    ollama: {
      tag: "shieldgemma4:latest",
      runCommand: "ollama run shieldgemma4:latest",
      modelfileSnippet: "FROM shieldgemma4:latest\nPARAMETER temperature 0.0\nSYSTEM \"ShieldGemma 4 Anti-Ragging and campus policy guard for NIT Hamirpur.\"",
    },
    kaggle: {
      handle: "google/shieldgemma-4/transformers/shieldgemma-4-2b",
      url: "https://www.kaggle.com/models/google/shieldgemma-4",
      frameworks: "PyTorch Safety Classifier",
    },
    lmStudio: {
      modelSearch: "google/shieldgemma-4-2b-GGUF",
      endpoint: "http://localhost:1234/v1/chat/completions",
      quantRecommendation: "INT4 AWQ",
    },
    docker: {
      image: "vllm/vllm-openai:latest",
      dockerRun: "docker run -d --gpus all -p 8000:8000 --ipc=host vllm/vllm-openai:latest --model google/shieldgemma-4-2b --port 8000",
      port: 8000,
    },
  },
};

// Aliases for backwards compatibility
GEMMA_4_WEIGHTS_REGISTRY["gemma-2"] = GEMMA_4_WEIGHTS_REGISTRY["gemma-4"];
GEMMA_4_WEIGHTS_REGISTRY["codegemma"] = GEMMA_4_WEIGHTS_REGISTRY["gemma-4-code"];
GEMMA_4_WEIGHTS_REGISTRY["paligemma"] = GEMMA_4_WEIGHTS_REGISTRY["gemma-4-vision"];
GEMMA_4_WEIGHTS_REGISTRY["shieldgemma"] = GEMMA_4_WEIGHTS_REGISTRY["gemma-4-guard"];
