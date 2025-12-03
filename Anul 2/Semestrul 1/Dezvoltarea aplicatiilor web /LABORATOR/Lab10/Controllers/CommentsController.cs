using ArticlesApp.Data;
using ArticlesApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace ArticlesApp.Controllers
{
    public class CommentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager) : Controller
    {
        private readonly ApplicationDbContext db = context;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;


        /*

        // Adaugarea unui comentariu asociat unui articol in baza de date
        [HttpPost]
        public IActionResult New(Comment comm)
        {
            comm.Date = DateTime.Now;

            if(ModelState.IsValid)
            {
                db.Comments.Add(comm);
                db.SaveChanges();
                return Redirect("/Articles/Show/" + comm.ArticleId);
            }

            else
            {
                return Redirect("/Articles/Show/" + comm.ArticleId);
            }
         }

        */


        // Stergerea unui comentariu asociat unui articol din baza de date
        // Se poate sterge comentariul doar de catre userii cu rolul de Admin 
        // sau de catre utilizatorii cu rolul de User sau Editor, doar daca 
        // acel comentariu a fost postat de catre acestia

        [HttpPost]
        [Authorize(Roles = "User,Editor,Admin")]
        public IActionResult Delete(int id)
        {
            Comment? comm = db.Comments.Find(id);

            if (comm == null)
            {
                return NotFound();
            }

            else
            {
                if (comm.UserId == _userManager.GetUserId(User) || User.IsInRole("Admin"))
                {
                    db.Comments.Remove(comm);
                    db.SaveChanges();
                    return Redirect("/Articles/Show/" + comm.ArticleId);
                }
                else
                {
                    TempData["message"] = "Nu aveti dreptul sa stergeti comentariul";
                    TempData["messageType"] = "alert-danger";
                    return RedirectToAction("Index", "Articles");
                }
            }          
        }

        // In acest moment vom implementa editarea intr-o pagina View separata
        // Se editeaza un comentariu existent
        // Editarea unui comentariu asociat unui articol
        // [HttpGet] - se executa implicit
        // Se poate edita un comentariu doar de catre utilizatorul care a postat comentariul respectiv 
        // Adminii pot edita orice comentariu, chiar daca nu a fost postat de ei

        [Authorize(Roles = "User,Editor,Admin")]

        public IActionResult Edit(int id)
        {
            Comment? comm = db.Comments.Find(id);

            if(comm is null)
            {
                return NotFound();
            }
            else
            {
                if (comm.UserId == _userManager.GetUserId(User) || User.IsInRole("Admin"))
                {
                    return View(comm);
                }
                else
                {
                    TempData["message"] = "Nu aveti dreptul sa editati comentariul";
                    TempData["messageType"] = "alert-danger";
                    return RedirectToAction("Index", "Articles");
                }
            }            
        }

        [HttpPost]
        [Authorize(Roles = "User,Editor,Admin")]
        public IActionResult Edit(int id, Comment requestComment)
        {
            Comment? comm = db.Comments.Find(id);

            if(comm is null)
            {
                return NotFound();
            }

            else
            {
                if (comm.UserId == _userManager.GetUserId(User) || User.IsInRole("Admin"))
                {
                    if (ModelState.IsValid)
                    {
                        comm.Content = requestComment.Content;

                        db.SaveChanges();

                        return Redirect("/Articles/Show/" + comm.ArticleId);
                    }
                    else
                    {
                        return View(requestComment);
                    }
                }
                else
                {
                    TempData["message"] = "Nu aveti dreptul sa editati comentariul";
                    TempData["messageType"] = "alert-danger";
                    return RedirectToAction("Index", "Articles");
                }
            }  
        }
    }
}
