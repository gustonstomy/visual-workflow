import {
  WorkflowNode,
  ExecutionContext,
  WeatherDataConfig,
  GitHubDataConfig,
  HTTPDataConfig,
} from "../../types";

export async function executeDataNode(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<any> {
  console.log(`Executing data node: ${node.subType}`);

  switch (node.subType) {
    case "weather":
      return await fetchWeatherData(node.config as WeatherDataConfig);

    case "github":
      return await fetchGitHubData(node.config as GitHubDataConfig);

    case "calendar":
      return await fetchCalendarData(node.config);

    case "http":
      return await fetchHTTPData(node.config as HTTPDataConfig);

    default:
      throw new Error(`Unknown data node type: ${node.subType}`);
  }
}

async function fetchWeatherData(config: WeatherDataConfig): Promise<any> {
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.warn("OpenWeather API key not configured, returning mock data");
    return {
      location: config.location,
      temperature: 72,
      condition: "Sunny",
      humidity: 65,
      wind: 10,
      units: config.units || "imperial",
    };
  }

  try {
    const units = config.units || "imperial";
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        config.location
      )}&appid=${apiKey}&units=${units}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      location: data.name,
      temperature: data.main.temp,
      condition: data.weather[0]?.main || "Unknown",
      description: data.weather[0]?.description || "",
      humidity: data.main.humidity,
      wind: data.wind.speed,
      units,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

async function fetchGitHubData(config: GitHubDataConfig): Promise<any> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn("GitHub token not configured, returning mock data");
    return {
      repository: `${config.owner}/${config.repository}`,
      type: config.type || "commits",
      items: [
        {
          id: "1",
          message: "Initial commit",
          author: "demo",
          date: new Date().toISOString(),
        },
        {
          id: "2",
          message: "Add feature X",
          author: "demo",
          date: new Date().toISOString(),
        },
      ],
    };
  }

  try {
    const type = config.type || "commits";
    let endpoint = "";

    switch (type) {
      case "commits":
        endpoint = `https://api.github.com/repos/${config.owner}/${config.repository}/commits`;
        break;
      case "issues":
        endpoint = `https://api.github.com/repos/${config.owner}/${config.repository}/issues`;
        break;
      case "prs":
        endpoint = `https://api.github.com/repos/${config.owner}/${config.repository}/pulls`;
        break;
      default:
        throw new Error(`Unknown GitHub data type: ${type}`);
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      repository: `${config.owner}/${config.repository}`,
      type,
      items: data.slice(0, 10),
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}

async function fetchCalendarData(config: any): Promise<any> {
  console.warn(
    "Google Calendar integration not implemented, returning mock data"
  );
  return {
    events: [
      {
        id: "1",
        title: "Team Meeting",
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      },
      {
        id: "2",
        title: "Project Review",
        start: new Date(Date.now() + 7200000).toISOString(),
        end: new Date(Date.now() + 10800000).toISOString(),
      },
    ],
  };
}

async function fetchHTTPData(config: HTTPDataConfig): Promise<any> {
  try {
    const options: RequestInit = {
      method: config.method || "GET",
      headers: config.headers || {},
    };

    if (config.body && (config.method === "POST" || config.method === "PUT")) {
      options.body = config.body;
    }

    const response = await fetch(config.url, options);

    if (!response.ok) {
      throw new Error(`HTTP request failed: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("Error making HTTP request:", error);
    throw error;
  }
}
