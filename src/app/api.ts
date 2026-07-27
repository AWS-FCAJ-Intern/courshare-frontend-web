const API_BASE_URL = "https://vym4gm40oc.execute-api.ap-southeast-1.amazonaws.com";

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
      if (token) {
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
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  }

  async register(email: string, password: string, fullName: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, fullName }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "Registration failed" }));
      throw new Error(err.message || "Registration failed");
    }
    const data: AuthResponse = await res.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    return data;
  }

  async getProfile(): Promise<UserProfile> {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch profile");
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

  async getCourses(params?: { categoryId?: string; search?: string }): Promise<ApiCourse[]> {
    const url = new URL(`${API_BASE_URL}/courses`);
    if (params?.categoryId && params.categoryId !== "All") {
      url.searchParams.append("categoryId", params.categoryId);
    }
    if (params?.search) {
      url.searchParams.append("search", params.search);
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

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
}

export const api = new ApiClient();
