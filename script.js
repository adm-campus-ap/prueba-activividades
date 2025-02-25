document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM cargado correctamente");

  const draggables = document.querySelectorAll(".draggable");
  const dropAreas = document.querySelectorAll(".drop-area");
  const verifyBtn = document.getElementById("verifyBtn");
  const retryBtn = document.getElementById("retryBtn");
  const screenshotBtn = document.getElementById("screenshotBtn");
  const feedback = document.getElementById("feedback");

  // 🔹 Configuración de categorías correctas
  const correctAssignments = {
      lumitas: ["irritabilidad", "servivo1", "servivo2", "servivo3"],
      numidas: ["reproduccion", "servivo1", "servivo2", "servivo3"],
      estelvinas: ["adaptacion", "servivo1", "servivo2", "servivo3"],
      mirico: ["sinvida1", "sinvida2"],
      fluvitos: ["sinvida1", "sinvida2"]
  };

  // 🔹 Evento Drag & Drop
  draggables.forEach(item => {
      item.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", item.id);
      });
  });

  dropAreas.forEach(area => {
      area.addEventListener("dragover", (e) => e.preventDefault());

      area.addEventListener("drop", (e) => {
          e.preventDefault();
          const id = e.dataTransfer.getData("text/plain");
          const draggedItem = document.getElementById(id);
          if (!draggedItem) return;

          // Permitir mover elementos dentro de la caja
          if (!area.querySelector(`#${id}`)) {
              area.appendChild(draggedItem);
          }
      });
  });

  // 🔹 Scroll Automático al Arrastrar
  document.addEventListener("dragover", (e) => {
      let scrollMargin = 50;
      let scrollSpeed = 10;

      if (e.clientY > window.innerHeight - scrollMargin) {
          window.scrollBy(0, scrollSpeed);
      } else if (e.clientY < scrollMargin) {
          window.scrollBy(0, -scrollSpeed);
      }
  });

  // 🔹 Verificación de Respuestas
  verifyBtn.addEventListener("click", () => {
      let correct = true;
      let messages = [];

      dropAreas.forEach(area => {
          const category = area.dataset.category;
          const elements = Array.from(area.children).map(el => el.id);

          if (!correctAssignments[category].every(id => elements.includes(id)) || elements.length !== correctAssignments[category].length) {
              correct = false;
              messages.push(`${category.charAt(0).toUpperCase() + category.slice(1)} está incorrecto.`);
          }
      });

      if (correct) {
          feedback.textContent = "✅ ¡Todo es correcto!";
          feedback.style.color = "green";
      } else {
          feedback.textContent = "❌ Hay errores en: " + messages.join(", ");
          feedback.style.color = "red";
      }
  });

  // 🔹 Reintentar (Restablecer Actividad)
  retryBtn.addEventListener("click", () => {
      dropAreas.forEach(area => {
          while (area.firstChild) {
              document.querySelector(".pool").appendChild(area.firstChild);
          }
      });

      feedback.textContent = "";
  });

  // 🔹 Captura de Pantalla
  screenshotBtn.addEventListener("click", () => {
      html2canvas(document.getElementById("evidencia"), {
          scale: 2,
          useCORS: true
      }).then(canvas => {
          const link = document.createElement("a");
          link.href = canvas.toDataURL("image/jpeg", 1.0);
          link.download = "actividad.jpg";
          link.click();
      });
  });
});
