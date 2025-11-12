using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArticlesApp.Models
{
    public class Article
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Titlul este obligatoriu")]
        public string Title { get; set; } 

        [Required(ErrorMessage = "Continutul articolului este obligatoriu")]
        public string Content { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        // relatie configuranta folosind conventiile de nume din EF
        
        public int CategoryId { get; set; } // cheia straina conform conventiilor

        //proprietate de navigare
        public virtual Category Category { get; set; } = null!;

        //un articol are o lista de comentarii
        public virtual ICollection<Comment> Comments { get; set; }  = new List<Comment>(); //sa scapam de warninguri




        /* daca nu se respect conventiile de nume de foloseste implementarea urmatoare
         * 
        public int CategId { get; set; } // nume care nu respecta conventia

        [ForeignKey(nameof(CategId))]
        public virtual Category Category { get; set; } = null!;

        */
    }

}
