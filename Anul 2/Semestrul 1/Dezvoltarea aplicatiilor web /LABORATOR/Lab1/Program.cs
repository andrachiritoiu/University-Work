using System.Xml.Linq;

namespace Lab2Gr2
{
    public class Program
    {

        static void Main(string[] args)
        {   //Problema 1 - proeict nou 

            //Problema 2 - implementare ex din laborator
            

            // CONVERSII IMPLICITE
            int nrInt = 10;

            // Metoda GetType() preia tipul de date
            Type tipNrInt = nrInt.GetType();

            // Conversie implicita
            double nrDouble = nrInt;

            // Se preia tipul
            Type tipNrDouble = nrDouble.GetType();

            // Afisare valori inainte de conversie
            Console.WriteLine("nrInt value: " + nrInt);
            Console.WriteLine("nrInt Type: " + tipNrInt);

            // Afisare valori dupa conversia implicita
            Console.WriteLine("nrDouble value: " + nrDouble);
            Console.WriteLine("nrDouble Type: " + tipNrDouble);






            double nDouble = 25.123;

            // Conversie explicita
            int nInt = (int)nDouble;

            // Afisarea valorii inainte de conversie
            Console.WriteLine("Valoarea inainte de conversie a fost: "
            + nDouble);

            // Afisarea valorii dupa conversie
            Console.WriteLine("Valoarea dupa conversie este: " +
            nInt);





            // CONVERSIE UTILIZAND PARSE()
            string st = "100";

            // tipul de date
            Type tip1 = st.GetType();

            // Se converteste tipul string in int
            int x = int.Parse(st);
            Type tip2 = x.GetType();
            Console.WriteLine("Valoarea initiala a fost: " + st);
            Console.WriteLine("A avut tipul: " + tip1);
            Console.WriteLine("Noua valoare dupa conversie este: " + x);
            Console.WriteLine("Valoarea dupa conversie are tipul: " + tip2);





            // CONVERSII FOLOSIND CLASA CONVERT
            int num = 25;
            Console.WriteLine("Valoare de tip int: " + num);

            // Se converteste valoarea int in stringul "25"
            string strConvert = Convert.ToString(num);
            Console.WriteLine("Valoarea dupa conversie " +
            strConvert);
            Console.WriteLine("Tipul dupa conversie: " +
            strConvert.GetType());

            // Conversie in Double
            Double doubleConvert = Convert.ToDouble(num);
            Console.WriteLine("Valoarea dupa conversie " +
            doubleConvert);

            Console.WriteLine("Tipul dupa conversie: " +
            doubleConvert.GetType());






            // NULLABLE - pate fi si null, dar si o valoare
            int? num1 = null;
            int? num2 = 45;
            Console.WriteLine("Valorile sunt: {0}, {1}", num1, num2);





            //Array
            int[] numere = { 1, 2, 3, 10, 20, 30 };
            Array.Sort(numere);

            int index = Array.IndexOf(numere, 10);//cauta valaorea data
            Console.WriteLine("Indexul lui 10 este: " + index);

            Array.Reverse(numere);





            //Lista - este alocata dinamic
            List<int> lista = new List<int> { 1, 2, 3 };
            lista.Add(4);
            lista.Remove(2);
            foreach (int i in lista)
                Console.WriteLine(i);





            //Problema 3 - palindrom
            //metodele daca sunt statice nu pot sa apleze this, daca fac metoda palindrom staticanu pot sa o aplez din main

            //varianta 1-in main
            //int n = int.Parse(Console.ReadLine());
            //if (n >= 0 && n <= 9)
            //{
            //    Console.WriteLine("Numarul este palindrom");
            //}
            //else
            //{
            //    string nr = n.ToString();
            //    string invers = new string(nr.Reverse().ToArray());
            //    if (nr == invers) Console.WriteLine("Numarul este palindrom");
            //    else
            //        Console.WriteLine("Numarul nu este palindrom");
            //}



            //varianta 2-cu o functie Palindrom(dintr-o clasa)
            //Palindrom p = new Palindrom(); // obiect de tipul clasei

            //int n = int.Parse(Console.ReadLine());//ReadLine citeste un string

            //bool rezultat = p.MetodaVerificarePalindrom(n);

            //if (rezultat == true)
            //    Console.WriteLine("Numarul este palindrom");
            //else
            //    Console.WriteLine("Numarul nu este palindrom");




            //Problema 4 - Se citește un vector V cu n elemente numere naturale (n<=100).
            //Verificați dacă oricare două elemente alăturate alternează ca
            //paritate(adică au paritate diferită).Să se afișeze un mesaj
            //corespunzător.

            int n=int.Parse(Console.ReadLine());
            int[] v = new int[n];  //de diminesiunea n

            for (int i = 0; i < n; i++)
            {
                v[i]=int.Parse(Console.ReadLine());
            }

            int ok = 1;

            for(int i = 0; i < n - 1; i++)
            {
                if (v[i] % 2 == v[i + 1] % 2) ok = 0;
            }

            if(ok==0)Console.WriteLine("Nu alterneaza");
            else
                Console.WriteLine("Alterneaza");

        }
    }

}

