const API_BASE_URL = "https://c1s4a83jbk.execute-api.ap-southeast-1.amazonaws.com";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  idToken?: string;
  id_token?: string;
  IdToken?: string;
}

export interface ApiCategory {
  id: string;
  name: string;
}

export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  categoryId: string;
  categoryName: string;
  price: number;
  published: boolean;
  createdAt: string;
}

export interface ApiSection {
  id: string;
  title: string;
  position: number;
  lessons: ApiLesson[];
}

export interface ApiLesson {
  id: string;
  title: string;
  description?: string;
  type: "VIDEO" | "TEXT" | "IMAGE" | "DOCUMENT";
  content?: string;
  duration?: string;
  videoUrl?: string;
  mediaUrl?: string;
  position: number;
  free: boolean;
}

export interface ApiCourseDetail extends ApiCourse {
  sections: ApiSection[];
}

class ApiClient {
  private getHeaders(authRequired = false): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authRequired) {
      const token = localStorage.getItem("accessToken");
      console.log(
        "[API] getHeaders authRequired=true.",
        "Token present:",
        !!token,
        token ? `(length: ${token.length}, starts with: ${token.substring(0, 15)}...)` : ""
      );
      if (token) {
        // If your Cognito/API Gateway authorizer expects the raw token without "Bearer ",
        // you can change this line to: headers["Authorization"] = token;
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Login failed" }));
      throw new Error(err.message || "Login failed");
    }
    const data: AuthResponse = await res.json();
    console.log("[API] Login raw response:", data);
    
    // API Gateway / Cognito typically requires ID Token for user attributes
    const token = data.idToken || data.id_token || data.IdToken || data.accessToken || data.access_token;
    console.log("[API] Using token:", token === data.accessToken ? "accessToken" : "idToken");
    
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    if (data.refreshToken || data.refresh_token) {
      localStorage.setItem("refreshToken", data.refreshToken || data.refresh_token || "");
    }
    return data;
  }

  async register(email: string, password: string, fullName: string, role: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, fullName, role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Registration failed" }));
      throw new Error(err.message || "Registration failed");
    }
    const data: AuthResponse = await res.json();
    console.log("[API] Register raw response:", data);
    
    const token = data.idToken || data.id_token || data.IdToken || data.accessToken || data.access_token;
    if (token) {
      localStorage.setItem("accessToken", token);
    }
    if (data.refreshToken || data.refresh_token) {
      localStorage.setItem("refreshToken", data.refreshToken || data.refresh_token || "");
    }
    return data;
  }

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    console.log("[API] getProfile response:", res);
    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error("[API] getProfile error body:", errorBody);
      console.error("[API] getProfile response headers:", [...res.headers.entries()]);
      throw new Error(`Failed to fetch profile (Status ${res.status}): ${errorBody || "Unknown Error"}`);
    }
    return res.json();
  }

  async getCategories(): Promise<ApiCategory[]> {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }
    return res.json();
  }

  async getCourses(params?: { categoryId?: string; search?: string; instructorId?: string }): Promise<ApiCourse[]> {
    const url = new URL(`${API_BASE_URL}/courses`);
    if (params?.categoryId && params.categoryId !== "All") {
      url.searchParams.append("categoryId", params.categoryId);
    }
    if (params?.search) {
      url.searchParams.append("search", params.search);
    }
    if (params?.instructorId) {
      url.searchParams.append("instructorId", params.instructorId);
    }
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch courses");
    }
    // Spring Page object has a "content" field
    const data = await res.json();
    return Array.isArray(data) ? data : data.content || [];
  }

  async getCourseDetail(id: string): Promise<ApiCourseDetail> {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch course details");
    }
    return res.json();
  }

  async createCourse(title: string, description: string, categoryId: string | null, price: number): Promise<ApiCourse> {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({ title, description, categoryId, price }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to create course" }));
      throw new Error(err.message || "Failed to create course");
    }
    return res.json();
  }

  async deleteCourse(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to delete course");
    }
  }

  async createSection(courseId: string, title: string, orderIndex: number): Promise<ApiSection> {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({ title, orderIndex }),
    });
    if (!res.ok) {
      throw new Error("Failed to create section");
    }
    return res.json();
  }

  async deleteSection(courseId: string, sectionId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to delete section");
    }
  }

  async createLesson(
    courseId: string,
    sectionId: string,
    title: string,
    description: string,
    type: string,
    videoUrl: string,
    mediaUrl: string,
    content: string,
    orderIndex: number
  ): Promise<ApiLesson> {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({ title, description, type, videoUrl, mediaUrl, content, orderIndex }),
    });
    if (!res.ok) {
      throw new Error("Failed to create lesson");
    }
    return res.json();
  }

  async deleteLesson(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to delete lesson");
    }
  }

  async updateProfile(fullName: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify({ fullName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to update profile" }));
      throw new Error(err.message || "Failed to update profile");
    }
    return res.json();
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/profile/password`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to change password" }));
      throw new Error(err.message || "Failed to change password");
    }
  }

  async getPublicProfile(userId: string): Promise<{ id: string; email: string; fullName: string }> {
    const res = await fetch(`${API_BASE_URL}/profile/public/${userId}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch public profile");
    }
    return res.json();
  }

  async getEnrollments(): Promise<{ data: any[] }> {
    const res = await fetch(`${API_BASE_URL}/enrollments/me`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      if (res.status === 404) {
        return { data: [] };
      }
      throw new Error("Failed to fetch enrollments");
    }
    return res.json();
  }

  async checkEnrollment(courseId: string): Promise<{ enrolled: { isEnrolled: boolean } }> {
    const res = await fetch(`${API_BASE_URL}/enrollments/${courseId}/check`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      return { enrolled: { isEnrolled: false } };
    }
    return res.json();
  }

  async enrollInCourse(courseId: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/enrollments`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify({ courseId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Failed to enroll" }));
      throw new Error(err.message || "Failed to enroll");
    }
    return res.json();
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const api = new ApiClient();
