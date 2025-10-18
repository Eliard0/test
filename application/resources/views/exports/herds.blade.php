<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Rebanhos do Produtor</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        th { background-color: #f0f0f0; }
    </style>
</head>
<body>
    <h2>Rebanhos do Produtor</h2>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Propriedade</th>
                <th>Espécie</th>
                <th>Quantidade</th>
                <th>Propósito</th>
                <th>Última Atualização</th>
            </tr>
        </thead>
        <tbody>
            @foreach($herds as $herd)
            <tr>
                <td>{{ $herd->id }}</td>
                <td>{{ $herd->property->name ?? 'N/A' }}</td>
                <td>{{ $herd->species }}</td>
                <td>{{ $herd->quantity }}</td>
                <td>{{ $herd->purpose }}</td>
                <td>{{ optional($herd->date_update)->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
