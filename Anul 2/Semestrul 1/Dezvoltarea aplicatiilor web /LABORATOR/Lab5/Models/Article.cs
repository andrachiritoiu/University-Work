using System.ComponentModel.DataAnnotations;

namespace Laborator5.Models
{
    public class Article
    {
        [Key]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }

    }
}
