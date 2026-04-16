import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase if possible
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Function to validate the Supabase token
async function validarToken(req: express.Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Não autorizado");
  }

  const token = authHeader.split("Bearer ")[1];
  
  if (!supabase) {
    throw new Error("Supabase não configurado");
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    console.error("Erro ao verificar token:", error?.message);
    throw new Error("Token inválido");
  }

  return user;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: /api/alunos
  app.get("/api/alunos", async (req, res) => {
    try {
      const usuario = await validarToken(req);
      const uid = usuario.id;

      // In a real app, we would fetch from Firestore here
      // For now, we'll return a mock response to demonstrate the API
      res.json([
        { uid: "1", fullName: "Aluno Exemplo 1", tipo: "aluno" },
        { uid: "2", fullName: "Aluno Exemplo 2", tipo: "aluno" }
      ]);
    } catch (error: any) {
      console.error("Auth error:", error.message);
      res.status(401).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
