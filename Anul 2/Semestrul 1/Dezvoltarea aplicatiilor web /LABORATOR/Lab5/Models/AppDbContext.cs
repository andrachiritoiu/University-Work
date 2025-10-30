using Microsoft.EntityFrameworkCore;

namespace Laborator5.Models
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) :base(options)
        {

        }

        public DbSet<Article> Articles { get; set; }
        public DbSet<Category> Categories { get; set; }

    }
}


// Constructor

// Clasa DbContextOptions din Entity Framework Core este esentiala pentru configurarea contextului de baza de date. Aceasta contine toate setarile necesare pentru cum contextul va interactiona cu o sursa de date specifica

// Stocheaza informatii precum string-ul de conexiune la baza de date si alte detalii specifice providerului de baze de date utilizat

// Parametrul "options" poate avea orice alt nume. Important este sa se pastreze tipul parametrului pentru a fi compatibil cu ceea ce framework-ul se asteapta sa primeasca

// DbSet<Article> defineste o colectie de entitati Article, unde Article este o clasa ce reflecta un tabel din baza de date. Prin DbSet, Entity Framework ofera acces direct la aceste entitati, permitand interogarea si modificarea datelor

// Este un concept esential in Entity Framework, care permite executarea operatiilor CRUD (Create, Read, Update, Delete) asupra entitatilor corespunzatoare din BD

