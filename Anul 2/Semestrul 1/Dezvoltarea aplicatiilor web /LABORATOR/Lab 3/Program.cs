var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();



//Exercitiul 1.1
//   /concatenare-pattern      /concatenare/s1=valoare/s2=valoare
//{}- var
//defaults- pt un pattern, daca nu sunt date valori, se folosesc valorile din defaults
app.MapControllerRoute(
    name: "Concatenare",
    pattern: "concatenare/{s1?}/{s2?}",
    defaults: new { controller = "Examples", action = "Concatenare"}
    );

//Exercitiul 1.2
app.MapControllerRoute(
    name: "Produs",
    pattern: "produs/{param1}/{param2?}",
    defaults: new { controller = "Examples", action = "Produs" }
    );


//Exercitiul 1.3
app.MapControllerRoute(
    name: "Operatie",
    pattern: "operatie/{param1?}/{param2?}/{op?}",
    defaults: new { controller = "Examples", action = "Operatie" }
    );



//Exercitiul 2
//  /Students/Index

//var1-direct
app.MapControllerRoute(
    name: "StudentsIndex",
    pattern: "{controller=Students}/{action=Index}"
    );

//var2-implemntatat de noi prin controller
app.MapControllerRoute(
    name: "StudentsIndex",
    pattern: "students/all",
    defaults: new {controller = "Students", action = "Index"}
    );


//Show
// students/{id}
//  /show/ - parametru de control
app.MapControllerRoute(
    name: "StudentsShow",
    pattern: "students/show/{id?}",
    defaults: new { controller = "Students", action = "Show" }
);


//Editare
// students/{id}
app.MapControllerRoute(
    name: "StudentsEdit",
    pattern: "students/edit/{id?}",
    defaults: new { controller = "Students", action = "Edit" }
);



//Stergere
// students/{id}
app.MapControllerRoute(
    name: "StudentsDelete",
    pattern: "students/delete/{id?}",
    defaults: new { controller = "Students", action = "Delete" }
);




//Exercitiul 3
app.MapControllerRoute(
    name: "NrTelefon",
    pattern: "search/telefon/{numar:regex()?}",
    defaults: new { controller = "Search", action = "NumarTelefon" }
    );


//lasam ruta default ultima
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
