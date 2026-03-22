export type PredictionResult = {
  prediction: string;
  class_idx: number;
  confidences?: Record<string, number>;
  success: boolean;
  error?: string;
};

export const analyzeScanImage = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    // Determine the API URL based on environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://brain-tumor-predictior.onrender.com/predict';
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); 

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle non-200 responses gracefully
      try {
        const errorData = await response.json();
        return { 
          success: false, 
          prediction: "", 
          class_idx: -1, 
          error: errorData.error || `Server error: ${response.status} ${response.statusText}` 
        };
      } catch {
         return { 
          success: false, 
          prediction: "", 
          class_idx: -1, 
          error: `Server responded with ${response.status} ${response.statusText}, but no error details.` 
        };
      }
    }

    const data = await response.json();
    return data;
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return { 
        success: false, 
        prediction: "", 
        class_idx: -1, 
        error: "The request took too long and timed out. The server might be busy or offline." 
      };
    }
    
    return { 
      success: false, 
      prediction: "", 
      class_idx: -1, 
      error: "Failed to connect to the backend analysis engine. Please ensure your connection is active." 
    };
  }
};
