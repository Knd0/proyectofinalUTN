// Client/src/components/ChatBot.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const responses: Record<string, string | JSX.Element> = {
  "¿Cómo cargo saldo?": (
    <>
      En el inicio, una vez logueado, verás un botón que indica 'Ingresar'. Entrás en el mismo y te llevará a una sección en la cual elegís el monto a cargar y en cuál divisa. Luego deberás completar con tu tarjeta a preferencia.
      <br />
      <Button href="/loadbalance" variant="contained" size="small" sx={{ mt: 1 }}>
        Ir a Depositar
      </Button>
    </>
  ),

  "¿Cómo envío dinero?": (
    <>
      Debés ingresar en la sección 'Transferir'. Deberás ingresar el CVU del destinatario, la moneda y el monto, y por último le das al botón de enviar.
      <br />
      <Button href="/transaction" variant="contained" size="small" sx={{ mt: 1 }}>
        Ir a Transferir
      </Button>
    </>
  ),

  "¿Cómo veo mi historial?": (
    <>
      Tu historial de transferencias aparecerá en el inicio de la página, debajo de las diferentes acciones como Ingresar, Transferir, etc.
      <br />
    </>
  ),

  "¿Cómo cambio mi moneda?": (
    <>
      Usá la sección de conversión de monedas, en el botón llamado 'Convertir'. Seleccioná el monto, el origen y por último el destino.
      <br />
      <Button href="/exchange" variant="contained" size="small" sx={{ mt: 1 }}>
        Ir a Convertir
      </Button>
    </>
  ),

  "¿Dónde veo mis datos?": (
    <>
      En el navbar verás un ícono de fotografía. Apretás ahí y te llevará a tu perfil.
      <br />
      <Button href="/profile" variant="contained" size="small" sx={{ mt: 1 }}>
        Ir a Perfil
      </Button>
    </>
  ),

  "¿Cómo confirmo mi cuenta?": (
    <>
      En el correo con el que te registraste llegará un enlace de confirmación. Solo debés entrar allí y esperar que te redirija a la página. Si nada de esto sucede, debés contactarte con el soporte.
      <br />
    </>
  ),
};

const options = Object.keys(responses);

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<Props> = ({ visible, onClose }) => {
  const [chat, setChat] = useState<{ from: "user" | "bot"; text: string | JSX.Element }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (opt: string) => {
    setChat((prev) => [
      ...prev,
      { from: "user", text: opt },
      { from: "bot", text: responses[opt] },
    ]);
  };

  // Auto scroll al final del chat
  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);

  if (!visible) return null;

  return (
    <Box
      data-aos="fade-up"
      sx={{
        position: "fixed",
        bottom: 80,
        right: 24,
        zIndex: 1000,
        width: 320,
      }}
    >
      <Paper elevation={8} sx={{ p: 2, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">🤖 Asistente Virtual Wamoney</Typography>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <Box
          ref={chatContainerRef}
          display="flex"
          flexDirection="column"
          gap={1}
          maxHeight={250}
          overflow="auto"
          mb={2}
        >
          {chat.map((m, i) => (
            <Box
              key={i}
              alignSelf={m.from === "user" ? "flex-end" : "flex-start"}
              bgcolor={m.from === "user" ? "primary.main" : "grey.300"}
              color={m.from === "user" ? "white" : "black"}
              px={2}
              py={1}
              borderRadius={2}
              maxWidth="80%"
            >
              <Typography variant="body2">{m.text}</Typography>
            </Box>
          ))}
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          {options.map((opt) => (
            <Button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              variant="outlined"
              size="small"
              sx={{ justifyContent: "flex-start", textTransform: "none" }}
            >
              {opt}
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatBot;
