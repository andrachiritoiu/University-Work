package com.pao.laboratory03.abstractclasses;

/** Subclasă concretă — implementare Oracle. */
public class OracleConnection extends DBConnection {

    public OracleConnection(String url) {
        super(url);
    }

    @Override
    public void connectToDb() {
        System.out.println("[Oracle] Conectare la: " + getUrl());
        System.out.println("[Oracle] Driver: oracle.jdbc.OracleDriver");
    }
}
