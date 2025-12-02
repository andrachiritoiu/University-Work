using Microsoft.AspNetCore.Identity;

namespace ArticlesApp.Models
{
    //Pasul 1:useri si roluri
    public class ApplicationUser : IdentityUser
    {
        //Pasul 6: useri si roluri
        //un user posteaza mai multe articole
        public virtual ICollection<Article> Articles { get; set; } = [];

        //un  unser posteza mai multe comentarii
        public virtual ICollection<Comment> Comnents { get; set; } = [];
    }
}
