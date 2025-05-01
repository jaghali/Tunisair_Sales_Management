import React, { useContext, useRef, useEffect } from "react";
import { IoMicOutline } from "react-icons/io5";
import { BiSend } from "react-icons/bi";
import { Context } from "../components/Context";
import { TextField } from "@mui/material";
import geminiImg from "../components/Images/gemini.png";
import background from "../components/Images/backgroundvideo.mp4";

const Gemini = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
    messages,
    clearMessages,
  } = useContext(Context);

  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, loading, resultData]);

  return (
    <main style={styles.main}>
      <video autoPlay muted loop playsInline src={background} style={styles.video} />

      <div style={styles.container}>
        <button style={styles.newChatButton} onClick={clearMessages}>
          + New Chat
        </button>

        <article style={styles.article} ref={chatRef}>
          {messages && messages.length === 0 ? (
            <div style={styles.greetingWrapper}>
              <div style={styles.greetingText}>
                <p style={styles.gradientText}>Hello.</p>
                <p style={styles.subText}>How can I help?</p>
              </div>
            </div>
          ) : (
            messages.map((msg, i) =>
              msg.role === "user" ? (
                <div key={i} style={styles.userPrompt}>
                  <p style={styles.userText}>{msg.content}</p>
                </div>
              ) : (
                <div key={i} style={styles.responseWrapper}>
                  <img src={geminiImg} alt="Gemini" style={styles.geminiImage} />
                  <div style={styles.geminiResponse}>{msg.content}</div>
                </div>
              )
            )
          )}

          {!showResult && (
            <div style={styles.resultContainer}>
              <div style={styles.userPrompt}>
                <p style={styles.userText}>{recentPrompt}</p>
              </div>

              <div style={styles.invisibleText}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit...
              </div>

              <div style={styles.responseWrapper}>
                {loading && <img src={geminiImg} alt="Gemini" style={styles.geminiImage} />}
                <div style={styles.geminiResponse}>
                  {loading ? (
                    <div style={styles.loadingBars}>
                      <hr style={styles.bar} />
                      <hr style={styles.bar} />
                      <hr style={{ ...styles.bar, ...styles.barShort }} />
                    </div>
                  ) : (
                    <p
                      className="responseText"
                      dangerouslySetInnerHTML={{ __html: resultData }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </article>

        <footer style={styles.footer}>
          <div style={styles.inputWrapper}>
            <TextField
              type="text"
              value={input}
              placeholder="Enter a prompt here"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSent();
                }
              }}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { padding: 0 },
              }}
              sx={{
                flexGrow: 1,
                background: "transparent",
                "& .MuiInputBase-input": {
                  padding: 0,
                  fontSize: "1rem",
                },
              }}
              style={styles.inputField}
            />

            <div style={styles.iconGroup}>
              <IoMicOutline />
              <BiSend onClick={onSent} />
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

const styles = {
  main: {
    flexGrow: 1,
  },
  container: {
    display: "grid",
    gridTemplateRows: "1fr min-content",
    height: "calc(100vh - 74px)",
    width: "100%",
    zIndex: 200,
  },
  article: {
    overflowY: "auto",
    textAlign: "left",
    padding: "1.5rem",
    width: "640px",
    margin: "0 auto",
    scrollbarWidth: "thin",
    scrollbarColor: "#ccc transparent",
    overscrollBehavior: "contain",
  },
  greetingWrapper: {
    display: "grid",
    placeContent: "center",
    marginTop: "15%",
    zIndex: 200,
  },
  greetingText: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: 500,
    zIndex: 200,
  },
  gradientText: {
    background: "linear-gradient(to right, #C80505, #FF5E5E)",
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
  },
  subText: {
    color: "#1f2937",
  },
  resultContainer: {
    display: "grid",
    gap: "1.75rem",
    width: "100%",
  },
  userPrompt: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    width: "100%",
  },
  userText: {
    color: "#1f2937",
    padding: "1rem",
    borderRadius: "0.75rem",
    width: "100%",
  },
  invisibleText: {
    opacity: 0,
  },
  responseWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    width: "100%",
  },
  geminiImage: {
    height: "2.5rem",
    width: "2.5rem",
  },
  geminiResponse: {
    color: "#1f2937",
    padding: "1rem",
    borderRadius: "0.75rem",
    width: "100%",
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
  loadingBars: {
    display: "grid",
    gap: "0.5rem",
    width: "100%",
  },
  bar: {
    height: "0.75rem",
    borderRadius: "0.375rem",
    background: "linear-gradient(to right, #ef4444, #fca5a5, #f87171)",
    backgroundSize: "200% auto",
    animation: "gradientTranslate 1.5s infinite linear",
  },
  barShort: {
    width: "66.666667%",
  },
  footer: {
    maxWidth: "64rem",
    padding: "1.5rem",
    width: "100%",
    margin: "0 auto",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "4rem",
    backgroundColor: "lightgrey",
    borderRadius: "9px",
    padding: "0.5rem 1.5rem",
  },
  inputField: {
    border: "none",
    outline: "none",
    flexGrow: 1,
    zIndex:200,
    background: "transparent",
  },
  iconGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "1.5rem",
    color: "#1f2937",
    cursor: "pointer",
    zIndex:200,

  },
  video: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.1,
    zIndex: 100,
  },
  newChatButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#C80505",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 201,
  },
};

export default Gemini;
