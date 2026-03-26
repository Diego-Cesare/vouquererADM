import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const listaPedidos = document.getElementById("listaPedidos");
const totalMarmitasEl = document.getElementById("totalMarmitas");
const totalRefeitorioEl = document.getElementById("totalRefeitorio");

// helper para data (aceita Timestamp ou string)
function parseData(data) {
  if (!data) return 0;
  if (data.seconds) return data.seconds * 1000; // Firestore Timestamp
  return new Date(data).getTime();
}

onSnapshot(
  collection(db, "pedidos"),
  (snapshot) => {
    let totalMarmitas = 0;
    let totalRefeitorio = 0;

    // transforma em array + mantém id
    const pedidos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // ordena por data (mais recente primeiro)
    pedidos.sort((a, b) => parseData(b.data) - parseData(a.data));

    // vazio
    if (pedidos.length === 0) {
      listaPedidos.innerHTML = `
      <p style="text-align:center; width:100%;">
        Nenhum pedido recebido ainda.
      </p>`;
      totalMarmitasEl.innerText = "0";
      return;
    }

    // render
    listaPedidos.innerHTML = pedidos
      .map((pedido) => {
        const qtd = Number(pedido.quantidade);
        const quantidade = Number.isNaN(qtd) ? 1 : qtd;

        totalMarmitas += quantidade;

        if (pedido.local && pedido.local.toLowerCase().includes("refeitorio")) {
          totalRefeitorio += quantidade;
        }

        const horario = pedido.data
          ? new Date(parseData(pedido.data)).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "--:--";

        const extras = (pedido.nombresExtras || [])
          .map((n) => `<span class="nome-tag">${n}</span>`)
          .join("");

        return `
      <div class="pedido-card">
        <div class="card-header">
          <h3>${pedido.requerente || "Sem nome"}</h3>
          <span class="badge-qtd">${quantidade} marmita(s)</span>
          </div>

        <div class="card-body">
          <p><strong>Local:</strong> ${pedido.local || "Não informado"}</p>
          <p><strong>Horário:</strong> ${horario}</p>
          ${extras ? `<div class="nomes-extras">${extras}</div>` : ""}
        </div>
        <button class="btn-delete" data-id="${pedido.id}">Apagar</button>

      </div>
    `;
      })
      .join("");

    totalMarmitasEl.innerText = totalMarmitas.toString();
    totalRefeitorioEl.innerText = totalRefeitorio.toString();
  },
  (error) => {
    console.error("Erro ao escutar pedidos:", error);

    listaPedidos.innerHTML = `
    <p style="color:red; text-align:center;">
      Erro ao carregar pedidos.
    </p>`;
  },
);

listaPedidos.addEventListener("click", async (e) => {
  const btn = e.target.closest(".btn-delete");
  if (!btn) return;

  const id = btn.dataset.id;

  if (!confirm("Deseja realmente apagar este pedido?")) return;

  try {
    await deleteDoc(doc(db, "pedidos", id));
  } catch (err) {
    console.error("Erro ao deletar:", err);
    alert("Erro ao apagar pedido.");
  }
});
