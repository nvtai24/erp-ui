import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7012/api", // Update with your API base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  // Uncomment below if you have HTTPS certificate issues (DEV ONLY)
  // httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

// Request interceptor: Ensure withCredentials is set for all requests
axiosClient.interceptors.request.use(
  (config) => {
    // Ensure withCredentials is always true for cookie-based auth
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response adapter: backend uses PascalCase ResponseData { Data, Message, Success, StatusCode, MetaData }
// while frontend expects camelCase ApiResponse { data, message, success, statusCode }.
// Backend's PagedList<T> serializes as an array, with separate MetaData field.
// This interceptor normalizes responses so existing services/components don't need changes.
axiosClient.interceptors.response.use(
  (response) => {
    const body = response.data as Record<string, unknown>;

    // Only adapt when server returns the PascalCase wrapper
    if (
      body &&
      typeof body === "object" &&
      ("Data" in body || "Message" in body || "Success" in body || "StatusCode" in body)
    ) {
      let adaptedData = body.Data ?? body.data;

      // Special handling for paged responses:
      // Backend returns Data as array + separate MetaData object.
      // Frontend expects data: { items: [...], pageIndex, pageSize, totalPages, totalCount, ... }
      if (Array.isArray(adaptedData) && body.MetaData && typeof body.MetaData === "object") {
        const meta = body.MetaData as Record<string, unknown>;
        adaptedData = {
          items: adaptedData,
          pageIndex: meta.CurrentPage ?? meta.currentPage ?? 1,
          pageSize: meta.PageSize ?? meta.pageSize ?? 10,
          totalPages: meta.TotalPages ?? meta.totalPages ?? 0,
          totalCount: meta.TotalItems ?? meta.totalItems ?? 0,
          hasPreviousPage: meta.HasPrev ?? meta.hasPrev ?? false,
          hasNextPage: meta.HasNext ?? meta.hasNext ?? false,
        };
      }

      const adapted: Record<string, unknown> = {
        data: adaptedData,
        message: body.Message ?? body.message,
        success: body.Success ?? body.success,
        statusCode: body.StatusCode ?? body.statusCode,
      };

      // Copy any other properties (for example when backend returns additional fields)
      for (const [k, v] of Object.entries(body)) {
        if (!["Data", "Message", "Success", "StatusCode", "MetaData"].includes(k)) {
          adapted[k] = v;
        }
      }

      response.data = adapted;
    }

    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Only redirect if not already on login page and not during login request
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes("/signin");
      const isLoginRequest = error.config?.url?.includes("/Accounts/Login");
      
      if (!isLoginPage && !isLoginRequest) {
        // Clear user data from localStorage
        localStorage.removeItem("user");
        
        // Use setTimeout to avoid interfering with HMR and allow error to propagate first
        setTimeout(() => {
          // Only redirect if still not on login page (avoid race conditions)
          if (!window.location.pathname.includes("/signin")) {
            const redirectUrl = encodeURIComponent(currentPath + window.location.search);
            window.location.href = `/signin?redirect=${redirectUrl}`;
          }
        }, 100);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;
