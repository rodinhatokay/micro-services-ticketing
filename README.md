# Microservices Study

This repository contains a set of microservices built to study microservices architecture using Kubernetes, Docker, events, and other related technologies.
It also includes a client application built with Next.js, and a shared common library published to npm.
Skaffold is used to start up everything.

## Project Structure

The repository is structured as follows:

- `auth`: Authentication service written in TypeScript with a MongoDB database.
- `client`: Client service (Next.js application) written in JavaScript.
- `common`: Shared library between the services (except for the client) written in TypeScript.
- `expiration`: Expiration service, a worker service written in TypeScript with a Redis database.
- `infra/k8s`: Kubernetes configuration files.
- `nats-test`: A small project built to test the nats-streaming-service and play around with it. This project is unrelated to the repository.
- `orders`: CRUD service that holds orders of tickets, written in TypeScript with a MongoDB database.
- `payments`: Payments service that holds all charges and orders, written in TypeScript with a MongoDB database. Third-party Stripe is also used.
- `tickets`: Ticket service that holds all tickets with CRUD option, written in TypeScript with a MongoDB database.
- `skaffold.yaml`: Configuration file for starting the development environment.
