using System.ComponentModel.DataAnnotations;

namespace ArticlesApp.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Continutul comentariului este obligatoriu")]
        public string Content { get; set; }

        public DateTime Date { get; set; }

        public int ArticleId { get; set; }

        //Pasul 6: useri si roluri
        //o cheie externa - un comentariu este postat d catere un user
        public string? UserId { get; set; }

        //proprietate de navigare
        //un comentariu este postat de un user
        public virtual ApplicationUser? User { get; set; }


        public virtual Article? Article { get; set; }
    }

}
