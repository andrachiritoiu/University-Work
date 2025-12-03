using System.ComponentModel.DataAnnotations.Schema;

namespace ArticlesApp.Models
{
    public class ArticleBookmark
    {
        // tabelul asociativ care face legatura intre Article si Bookmark
        // un articol are mai multe colectii din care face parte
        // iar o colectie contine mai multe articole in cadrul ei

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        // cheie primara compusa (Id, ArticleId, BookmarkId)
        public int Id { get; set; }
        public int? ArticleId { get; set; }
        public int? BookmarkId { get; set; }

        public virtual Article? Article { get; set; }
        public virtual Bookmark? Bookmark { get; set; }

        public DateTime BookmarkDate { get; set; }
    }
}

