<h1>Sistema de subastas</h1>
<h2>Arquitectura</h2>
![arquitectura](https://user-images.githubusercontent.com/11670961/42542004-2efab230-847b-11e8-86cd-95640e56da62.png)


La arquitectura cuenta con 3 componentes lógicos:

<h4> Load Balancer</h4>
Todos los clientes van a comunicarse directa y únicamente con este componente. Por lo tanto, este componente se encarga de rutear estos distintos requests a los <b>Servers</b>.<br>
Subcomponentes lógicos:
<ul>
<li>Server Registry: Lleva un registro de todos los servers levantados, sus direcciones y que subastas están corriendo. El <b>Load Balancer</b> recibe esta información del <b>Supervisor</b>.</li>
<li>Router: Selecciona el <b>Server</b> hacia el cual se va a redirigir el request. Según el request:
    <ol>
        <li>Registro de nuevo comprador: Selecciona un server al azar</li>
        <li>Creación de nueva subasta: Selecciona un servidor al azar (en futuras iteraciones estaría bueno que se seleccione en base a la cantidad de subastas que está corriendo cada uno)</li>
        <li>Requests referidos a una subasta en curso: Selecciona al <b>Server</b> que esté corriendo dicha subasta</li>
    </ol>
</li>
</ul>

<h4> Server (n instancias)</h4>
Estos van a ser los componentes encargados de correr las subastas y de registrar los nuevos compradores.<br>
Está en constante comunicación (no bloqueante) con el <b>Supervisor</b> a fin de sincronizar la información con el resto del sistema.<br>
Se comunica también con los clientes a fin de notificarles sobre las subastas que corre, finalización y cancelación de las mismas y las nuevas ofertas.<br>
Subcomponentes lógicos:
<ol>
<li>Buyers Registry: Lleva un registro de los compradores y sus tags de interés. Ante un request de nuevo comprador, se agrega a este y se notifica al <b>Supervisor</b>, para que lo sincronice con el resto de los servers.</li>
<li>Bid Manager: Encargado de crear y correr las subastas.</li>
<li>Notifier: Componente dedicado a la comunicación con el <b>Supervisor</b> y los clientes.</li>
</ol>

<h4>Supervisor</h4>
El Supervisor es el encargado de:
<ul>
<li>Instanciar los <b>Servers</b> en el arranque del sistema. La información sobre estos (ids, direcciones) se le suministra vía archivo de configuración.</li>
<li>Enviar las direcciones de los distintos servers al <b>Load Balancer</b> en el arranque del sistema. La dirección de este se le suministra vía archivo de configuración.</li>
<li>Monitorear continuamente los Servers y levantarlos en caso de caída, enviándoles la información necesaria para que reanuden las subastas que estaban corriendo.</li>
<li>Recibir updates de nuevos compradores por parte del <b>Server</b> que haya tomado el request y sincronizarlo con el resto.</li>
    <li>Recibir updates de las subastas por parte del <b>Server</b> que esté corriendo cada una, a fin de resguardar la información en caso de caída de dicho <b>Server</b>.</li>
<li>Ante la creación de una nueva subasta, notificar al <b>Load Balancer</b> sobre que <b>Server</b> la está corriendo, a fin de que todos los requests de esta sean redirigidos a él.</li>
</ul>
Subcomponentes lógicos:
<ol>
<li>Server Monitor: Monitorea vía healthcheck a los <b>Servers</b> bajo su supervisión.</li>
<li>Instantiator: Levanta los <b>Servers</b>, tanto en el arranque del sistema como en caso de caída de uno. Por ahora, utilizamos un Local Instantiator (para instanciar servers en la misma máquina que el Supervisor), pero puede extenderse facilmente para otros tipos de instanciación. </li>
<li>Load Balancer Communicator: Maneja todos los requests hacia el <b>Load Balancer</b>.</li>
<li>Server Communicator: Maneja todos los requests hacia los <b>Servers</b>.</li>
</ol>

<h2>Decisiones de diseño</h2>
<ol>
<li>Utilizar un <b>Load Balancer</b>.
    <ul>
        <li>Su razón de ser es abstraer a los clientes de la cantidad de servers levantados, sus direcciones y cuál está manejando qué subasta.</li>
    </ul>
</li>
<li>Almacenar la información de todos los compradores en todos los <b>Servers</b>.
    <ul>
        <li>Está decisión fue tomada para maximizar la disponibilidad de estos datos. También, una vez iniciada la subasta, los <b>Servers</b>  pueden ser totalmente autónomos en cuanto a la comunicación con los compradores, no los afectaría una partición de red con el <b>Supervisor</b>.</li>
    </ul>
</li>
<li>Almacenar la información de todas las subastas en el <b>Supervisor</b>.
    <ul>
        <li>Necesitamos almacenar la información crítica de las subastas en algún lugar. Si no lo hiciéramos, al caerse un <b>Server</b> se perdería esta información y no se podría reanudar la subasta.</li>
        <li>Decidimos no almacenar toda esta información en todos los <b>Servers</b>, como en el caso de los compradores, ya que por un lado a cada <b>Server</b> sólo le interesa las subastas que está corriendo. Y, por otro lado, necesitaríamos diseñar un algoritmo de sincronización por consenso, el cual está por fuera de nuestra expertise.</li>
    </ul>
</li>
<li>Utilizar al <b>Supervisor</b> para sincronizar la información de compradores.
    <ul>
        <li>Como en la decisión anterior, no hacer esto implicaría un complejo algoritmo de sincronización peer to peer.</li>
    </ul>
</li>
</ol>

<h2>Puesta en marcha</h2>
<h4>Load Balancer</h4>
(en tpIASC) <b>node src/LoadBalancer/LoadBalancer.js [puerto]</b>
<h4>Supervisor</h4>
(en tpIASC) <b>node src/Supervisor/Supervisor.js [puerto]</b>
