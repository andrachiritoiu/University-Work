activateStructure(powerModule(X), Y) :-
    verifyComponent(X),
    matchResource(Y, X) .

verifyComponent(X) :-
    combineElements(craftToken(Y), X),
    matchResource(Y, Y).

matchResource(oakLog, oakLog).

matchResource(redstoneBlock, redstoneBlock).

combineElements(craftToken(oakLog), redstoneBlock).
