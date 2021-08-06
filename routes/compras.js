var express = require('express');
var router = express.Router();
var cielo = require('../lib/cielo');

/* POST criacao de compras */
router.post('/', function(req, res, next) {
  cielo.compra(req.body).then((result) => {
    const payId = result.Payment.PaymentId;
    cielo.captura(result.Payment.PaymentId)
    .then((result) => {


      if (result.Status == 2){
        res.status(201).send({
          "Status": "Sucesso",
          "Message": "Compra realizada com sucesso",
          "CompraId": payId
        });
      }
      else {
        res.status(402).send({
          "Status": "Sem Sucesso",
          "Message": "Falhou alguma coisa",
          "CompraId": payId
        });
      }

    })
    .catch((error) => {
      console.log(error)
    })
  })
});

/* GET status compras */
router.get('/:compra_id/status', function(req, res, next) {
  cielo.consulta(req.params.compra_id)
  .then((result) => {
    let message = {};

    switch(result.Payment.Status) {
      case 0:  
        message = {
          'Status' : 'Não finalizado'
        };
        break;
      case 1:  
        message = {
          'Status' : 'Pagamento autorizado'
        };
        break;
      case 2:  
        message = {
          'Status' : 'Pagamento finalizado'
        };
        break;
      case 3:  
        message = {
          'Status' : 'Pagamento Negado'
        };
        break;
      case 10:  
        message = {
          'Status' : 'Cancelado'
        };
        break;
      case 11:  
        message = {
          'Status' : 'Estornado'
        };
        break;
      case 12:  
        message = {
          'Status' : 'Pendente'
        };
        break;
      case 13:  
        message = {
          'Status' : 'Aborted'
        };
        break;
      case 20:  
        message = {
          'Status' : 'Agendado'
        };
        break;
      default:  
        message = {
          'Status' : 'Não foi possível obter status'
        };
        break;
    }
    res.send(message);
  });
});

module.exports = router;
