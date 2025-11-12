using System.ComponentModel.DataAnnotations;

namespace ArticlesApp.Models
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Continutul este obligatoriu")]
        public string Content { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Selectati articolul.")]
        public int ArticleId { get; set; }

        public virtual Article Article { get; set; } = null!;  //sa fie obligatorie 
    }

}
