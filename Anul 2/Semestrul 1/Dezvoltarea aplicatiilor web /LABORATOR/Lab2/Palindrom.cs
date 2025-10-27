using System;

public class Palindrom
{
    int n;
  
    public Palindrom(){}
    public Palindrom(int n)
    {
        this.n = n;
    }

    public bool MetodaVerificarePalindrom(int n)
    {
        string s = n.ToString();
        string invers = new string(s.Reverse().ToArray()); //reverse reuturneaza un iterabil care trebuie transformat in array
        return s == invers;
    }
}
