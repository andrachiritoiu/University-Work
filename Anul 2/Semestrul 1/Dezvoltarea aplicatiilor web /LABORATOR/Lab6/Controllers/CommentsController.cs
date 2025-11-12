using ArticlesApp.Models;
using ArticlesAppLab6.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace ArticlesAppLab6.Controllers
{
    public class CommentsController(ApplicationDbContext context) : Controller
    {
        private readonly ApplicationDbContext db = context;

        public IActionResult Index()
        {
            var comments = db.Comments
                             .Include(c => c.Article)
                             .OrderByDescending(c => c.Date)
                             .ToList();

            return View(comments);
        }

        public IActionResult Show(int id)
        {
            Comment? comment = db.Comments
                                 .Include(c => c.Article)
                                 .FirstOrDefault(c => c.Id == id);

            if (comment == null)
            {
                return NotFound();
            }

            return View(comment);
        }

        public IActionResult New(int? articleId = null)
        {
            PopulateArticlesDropdown(articleId ?? 0);

            return View(new Comment { ArticleId = articleId ?? 0 });
        }

        [HttpPost]
        public IActionResult New(Comment comment)
        {
            if (!ModelState.IsValid)
            {
                PopulateArticlesDropdown(comment.ArticleId);
                return View(comment);
            }

            comment.Date = DateTime.Now;
            db.Comments.Add(comment);
            db.SaveChanges();

            return RedirectToAction("Show", "Articles", new { id = comment.ArticleId });
        }

        public IActionResult Edit(int id)
        {
            Comment? comment = db.Comments.Find(id);

            if (comment == null)
            {
                return NotFound();
            }

            PopulateArticlesDropdown(comment.ArticleId);

            return View(comment);
        }

        [HttpPost]
        public IActionResult Edit(int id, Comment requestComment)
        {
            Comment? comment = db.Comments.Find(id);

            if (comment == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                PopulateArticlesDropdown(requestComment.ArticleId);
                return View(requestComment);
            }

            comment.Content = requestComment.Content;
            comment.ArticleId = requestComment.ArticleId;

            db.SaveChanges();

            return RedirectToAction("Show", "Articles", new { id = comment.ArticleId });
        }

        [HttpPost]
        public IActionResult Delete(int id)
        {
            Comment? comment = db.Comments.Find(id);

            if (comment == null)
            {
                return NotFound();
            }

            int articleId = comment.ArticleId;

            db.Comments.Remove(comment);
            db.SaveChanges();

            return RedirectToAction("Show", "Articles", new { id = articleId });
        }

        private void PopulateArticlesDropdown(int selectedArticleId)
        {
            var articles = db.Articles
                             .OrderBy(a => a.Title)
                             .Select(a => new SelectListItem
                             {
                                 Value = a.Id.ToString(),
                                 Text = a.Title,
                                 Selected = a.Id == selectedArticleId
                             })
                             .ToList();

            ViewBag.Articles = articles;
        }
    }
}