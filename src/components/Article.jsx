import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleContent, setNewArticleContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editArticleTitle, setEditArticleTitle] = useState("");
  const [editArticleContent, setEditArticleContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(3);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("http://localhost/wordpress-6.5.2-it_IT/wordpress/wp-json/wp/v2/posts?_embed=1");
        if (!response.ok) {
          throw new Error("Errore durante il recupero degli articoli");
        }
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error(error);
        setError("Errore durante il recupero degli articoli");
      }
    };

    fetchArticles();
  }, []);

  const deletePost = async (postId) => {
    try {
      const authString = "marco:cXE9kiPVWPuVysmFytKPscZU";
      const encodedAuthString = btoa(authString);
      const response = await fetch(`http://localhost/wordpress-6.5.2-it_IT/wordpress/wp-json/wp/v2/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
      });
      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione del post");
      }
      setArticles((prevArticles) => prevArticles.filter((article) => article.id !== postId));
    } catch (error) {
      console.error(error);
      setError("Errore durante l'eliminazione del post");
    }
  };

  const openModal = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedArticle(null);
  };

  const handleNewArticleTitleChange = (event) => {
    setNewArticleTitle(event.target.value);
  };

  const handleNewArticleContentChange = (event) => {
    setNewArticleContent(event.target.value);
  };

  const handleAddArticle = async () => {
    try {
      const authString = "marco:cXE9kiPVWPuVysmFytKPscZU";
      const encodedAuthString = btoa(authString);
      const apiUrl = "http://localhost/wordpress-6.5.2-it_IT/wordpress/wp-json/wp/v2/posts";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: JSON.stringify({
          title: newArticleTitle,
          content: newArticleContent,
          status: "publish",
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'inserimento del nuovo articolo");
      }

      const newArticle = await response.json();

      setArticles([...articles, newArticle]);
      setShowAddModal(false);
      setNewArticleTitle("");
      setNewArticleContent("");
    } catch (error) {
      console.error(error);
      setError("Errore durante l'inserimento del nuovo articolo");
    }
  };

  const handleEditArticleTitleChange = (event) => {
    setEditArticleTitle(event.target.value);
  };

  const handleEditArticleContentChange = (event) => {
    setEditArticleContent(event.target.value);
  };

  const handleEditArticle = async () => {
    try {
      const authString = "marco:cXE9kiPVWPuVysmFytKPscZU";
      const encodedAuthString = btoa(authString);
      const apiUrl = `http://localhost/wordpress-6.5.2-it_IT/wordpress/wp-json/wp/v2/posts/${selectedArticle.id}`;
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${encodedAuthString}`,
        },
        body: JSON.stringify({
          title: editArticleTitle,
          content: editArticleContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Errore durante la modifica dell'articolo");
      }

      const updatedArticle = await response.json();
      const updatedArticles = articles.map((article) => {
        if (article.id === updatedArticle.id) {
          return updatedArticle;
        }
        return article;
      });

      setArticles(updatedArticles);
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
      setError("Errore durante la modifica dell'articolo");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset current page when search term changes
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const filteredArticles = articles.filter((article) =>
    article.title.rendered.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="mt-5 mb-4">Ultimi Articoli</h1>
        <div className="text-center mt-3">
          <Button className="mt-5 mb-5" variant="success" onClick={() => setShowAddModal(true)}>
            Aggiungi Nuovo Articolo
          </Button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <input
            type="text"
            className="form-control mt"
            placeholder="Cerca per titolo..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="row">
          {currentArticles.map((article) => (
            <div key={article.id} className="col-xs-6 col-md-6 col-lg-4 mb-4">
              <div className="card">
                <img
                  src={
                    article._embedded && article._embedded["wp:featuredmedia"]
                      ? article._embedded["wp:featuredmedia"][0].source_url
                      : ""
                  }
                  className="card-img-top"
                  alt=""
                />
                <div className="card-body">
                  <h5 className="card-title">{article.title.rendered}</h5>
                  <p className="card-text" dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }}></p>
                </div>
                <div className="card-footer" style={{ display: "flex", justifyContent: "space-between" }}>
                  <button className="btn btn-danger" onClick={() => deletePost(article.id)}>
                    Elimina
                  </button>
                  <div>
                    <button className="btn btn-primary mr-2" onClick={() => openModal(article)}>
                      Visualizza
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditArticleTitle(article.title.rendered);
                        setEditArticleContent(article.content.rendered);
                        setSelectedArticle(article);
                        setShowEditModal(true);
                      }}
                    >
                      Modifica
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            {[...Array(Math.ceil(filteredArticles.length / articlesPerPage)).keys()].map((number) => (
              <li key={number} className="page-item">
                <button onClick={() => paginate(number + 1)} className="page-link">
                  {number + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <Modal show={selectedArticle !== null && !showEditModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedArticle?.title.rendered}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p dangerouslySetInnerHTML={{ __html: selectedArticle?.content.rendered }}></p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Inserisci Nuovo Articolo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="newArticleTitle">Titolo</label>
              <input
                type="text"
                className="form-control"
                id="newArticleTitle"
                value={newArticleTitle}
                onChange={handleNewArticleTitleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newArticleContent">Contenuto</label>
              <textarea
                className="form-control"
                id="newArticleContent"
                value={newArticleContent}
                onChange={handleNewArticleContentChange}
              ></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleAddArticle}>
            Aggiungi
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Articolo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="editArticleTitle">Titolo</label>
              <input
                type="text"
                className="form-control"
                id="editArticleTitle"
                value={editArticleTitle}
                onChange={handleEditArticleTitleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="editArticleContent">Contenuto</label>
              <textarea
                className="form-control"
                id="editArticleContent"
                value={editArticleContent}
                onChange={handleEditArticleContentChange}
              ></textarea>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleEditArticle}>
            Salva Modifiche
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ArticleList;
